import { getWishlist, updateWishlist } from "../utils/storageUtils";
import { useState, useEffect } from "react";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const remove = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    updateWishlist(updated);
    setWishlist(updated);
  };

  return (
    <>
      <div className="shopheader">
        <h1>Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <p>Your wishlist is empty</p>
          <a href="/items">Discover More</a>
        </div>
      ) : (
        <div className="bestsellers shop">
          <div className="items">
            {wishlist.map((item) => (
              <div className="item" key={item.id}>
                <div className="visual">
                  <img src={item.image} alt={item.title} />
                  <button className="quickadd">
                    <a href={`/item/${item.id}`}>Quick add</a>
                  </button>
                  <button className="favorite" onClick={() => remove(item.id)}>
                    <a href="#">
                      <i className="bx bx-heart"></i>
                    </a>
                  </button>
                </div>
                <div className="details">
                  <p>{item.category || "curl talk"}</p>
                  <h1>{item.title}</h1>
                  <p>{item.description || "frizz control"}</p>
                  <h1>${item.price.toFixed(2)}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Wishlist;
