import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import woman from "../images/woman.png";
import categoryImg from "../images/category.png";
import logo from "../images/logo.png";
import banner from "../images/banner.png";
import featuring from "../images/featuring.jpg";
import featuring1 from "../images/featuring1.png";
import featuring2 from "../images/featuring2.png";
import featuring3 from "../images/featuring3.png";
import featuring4 from "../images/featuring4.png";
import catalogue1 from "../images/catalogue1.jpg";
import catalogue2 from "../images/catalogue2.jpg";
import catalogue3 from "../images/catalogue3.jpg";
import catalogue4 from "../images/catalogue4.jpg";
import catalogue5 from "../images/catalogue5.jpg";

import {
  getCart,
  updateCart,
  getWishlist,
  updateWishlist,
} from "../utils/storageUtils";


function Home() {
  const [categories, setCategories] = useState([]);
  const [latestItems, setLatestItems] = useState([]);
  const [cart, setCart] = useState(getCart());
  const [wishlist, setWishlist] = useState(getWishlist());
  const featuringImages = [featuring, featuring1, featuring2, featuring3, featuring4];

  const catalogueTitles = [
    "Curl Care",
    "Color Care",
    "Defrizz + Smooth",
    "2nd Day Hair",
    "Moisture",
  ];

  const catalogueImages = [
    catalogue1,
    catalogue2,
    catalogue3,
    catalogue4,
    catalogue5,
  ];

  useEffect(() => {
    axios.get("http://localhost:5000/items").then((res) => {
      const allItems = res.data;

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(allItems.map((item) => item.category))
      );
      setCategories(uniqueCategories);

      // Get latest 3 items
      const latest = [...allItems]
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);
      setLatestItems(latest);
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

  return (
    <>
      <div className="header">
        <div className="title">
          <h1>Welcome to the next generation of Loyalty</h1>
          <p>
            Earn coins through challenges, events, and shopping your faves. Then,
            cash in those coins for sweet discounts!
          </p>
          <button>
            <Link to='auth'>Join The Hearts Club</Link>
          </button>
        </div>
        <div className="image">
          <img src={woman} alt="woman" />
        </div>
      </div>

      <div className="shopby">
        <div className="title">
          <p>Shop By:</p>
        </div>
        <div className="categories">
          {categories.map((cat, i) => (
            <Link
              to={`/items?category=${encodeURIComponent(cat)}`}
              className="category"
              key={i}
            >
              <img src={categoryImg} alt={cat} />
              <p>{cat}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="header banner1">
        <div className="title">
          <img src={logo} alt="logo" />
          <h1>
            Celebrating high quality, salon inspired, clean haircare for all
            generations.
          </h1>
        </div>
        <div className="image">
          <img src={banner} alt="banner" />
        </div>
      </div>

      <div className="bestsellers">
        <div className="items">
          <div className="item itembanner">
            <div className="visual">
              <img src={banner} alt="best seller" />
              <button className="shopbest">
                <Link to="/items">Shop bestsellers</Link>
              </button>
            </div>
          </div>

          {latestItems.map((item) => (
            <div className="item" key={item.id}>
              <div className="visual">
                <Link to={`/item/${item.id}`}>
                  <img src={item.image} alt={item.title} />
                </Link>

                {/* Use buttons directly without anchor tags inside */}
                <button
                  className="quickadd"
                  onClick={() => toggleCart(item)}
                  type="button"
                >
                  {isInCart(item) ? "Remove from Cart" : "Quick add"}
                </button>

                <button
                  className="favorite"
                  onClick={() => toggleWishlist(item)}
                  type="button"
                >
                  <i
                    className={`bx bx-heart heart-icon ${
                      isInWishlist(item) ? "red" : ""
                    }`}
                  ></i>
                </button>
              </div>

              <div className="details">
                <p>{item.category}</p>
                <h1>{item.title}</h1>
                <p>{item.description}</p>
                <h1>${item.price}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="imagecatalogue featuring">
        <div className="title">
          <h1>Featuring...</h1>
        </div>
        <div className="images">
          {featuringImages.map((featuring, i) => (
            <Link className="image" to='/items' key={i}>
              <img src={featuring} alt="featuring" />
            </Link>
          ))}
        </div>
      </div>

      <div className="imagecatalogue">
        <div className="title">
          <h1>Hello, Hair Needs</h1>
          <p>better hair days start here</p>
        </div>
        <div className="images">
          {catalogueImages.map((img, i) => (
            <Link className="image" to='/items' key={i}>
              <img src={img} alt={`catalogue${i + 1}`} />
              <h1>{catalogueTitles[i]}</h1>
            </Link>
          ))}
        </div>
      </div>

      <div className="about-us section" id="about">
        <div className="title">
          <h1>About Us</h1>
          <p>
            At Not Your Mother's, we’re all about embracing individuality and expressing your unique style through vibrant, effective haircare products.  
            From bold textures to everyday maintenance, our formulas are designed to empower every type of hair and every personality.
          </p>
          <p>
            Founded with a passion for fun, fearless, and accessible beauty, we believe great hair starts with great products — no complicated routines required.  
            Join the movement and discover haircare that’s truly “Not Your Mother’s.”
          </p>
        </div>
        <div className="about-image">
          <img src="https://notyourmothers.com/cdn/shop/files/FullHeartLockupOnce_f07bdc6e-b78f-4e31-8fd2-de04abc8cdd7_2400x2400.gif?v=1678985268"alt="About Us" />
        </div>
      </div>


    </>
  );
}

export default Home;
