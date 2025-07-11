import { useEffect, useState } from "react";
import axios from "axios";
import {
  getCart,
  updateCart,
  getWishlist,
  updateWishlist,
} from "../utils/storageUtils";
import { Link, useLocation } from "react-router-dom";

const categories = [
  "All",
  "Best Sellers",
  "Curl Talk",
  "Shampoo & Conditioner",
  "Dry Shampoo",
  "NYM Kids"
];

function Items() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(getCart());
  const [wishlist, setWishlist] = useState(getWishlist());
  const categoryParam = new URLSearchParams(window.location.search).get("category");

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [sortOrder, setSortOrder] = useState("featured");

  const query = new URLSearchParams(window.location.search).get("search");
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const search = params.get("search");

    setSelectedCategory(category || "All");
    setSearchQuery(search || "");
  }, [location.search]);

  useEffect(() => {
    axios.get("http://localhost:5000/items").then((res) => {
      setItems(res.data);
    });
  }, []);

  const isInCart = (item) => cart.some((i) => i.id === item.id);
  const isInWishlist = (item) => wishlist.some((i) => i.id === item.id);

  const toggleCart = (item) => {
    const updated = isInCart(item)
      ? cart.filter((i) => i.id !== item.id)
      : [...cart, item];
    updateCart(updated);
    setCart(updated);
  };

  const toggleWishlist = (item) => {
    const updated = isInWishlist(item)
      ? wishlist.filter((i) => i.id !== item.id)
      : [...wishlist, item];
    updateWishlist(updated);
    setWishlist(updated);
  };

  const filteredItems = items
    .filter((item) => {
      const titleMatch = query
        ? item.title.toLowerCase().includes(query.toLowerCase())
        : true;
      const categoryMatch =
        selectedCategory === "All" || item.category === selectedCategory;
      return titleMatch && categoryMatch;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") return b.id - a.id;
      if (sortOrder === "popular") return a.price - b.price;
      return 0;
    });

  return (
    <>
      <div className="shopheader">
        <h1>Shampoo + Conditioner</h1>
      </div>

      <div className="filterbar">
        <div className="links">
          {categories.map((cat) => (
            <a
              key={cat}
              href="#"
              className={`link ${selectedCategory === cat ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory(cat);
              }}
            >
              {cat}
            </a>
          ))}
        </div>

        <div className="filterby">
          <select
            name="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="featured">FEATURED</option>
            <option value="newest">NEWEST</option>
            <option value="popular">MOST POPULAR</option>
          </select>
        </div>
      </div>

      <div className="bestsellers shop">
        <div className="items">
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: "center", width: "100%", marginTop: "50px", fontWeight: '100', fontSize:'32px' }}>
              <p>No items found for "{selectedCategory}"</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div className="item" key={item.id}>
                <div className="visual">
                  <Link to={`/item/${item.id}`}>
                  <img src={item.image} alt={item.title} />
                  </Link>
                  <button className="quickadd" onClick={() => toggleCart(item)}>
                    <a href="#">
                      {isInCart(item) ? "Remove from Cart" : "Quick add"}
                    </a>
                  </button>

                  <button className="favorite" onClick={() => toggleWishlist(item)}>
                    <a href="#">
                      <i
                        className={`bx bx-heart heart-icon ${
                          isInWishlist(item) ? "red" : ""
                        }`}
                      ></i>
                    </a>
                  </button>
                </div>

                <div className="details">
                  <p>{item.category || "Curl Talk"}</p>
                  <h1>{item.title}</h1>
                  <p>{item.description}</p>
                  <h1>${item.price}</h1>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Items;
