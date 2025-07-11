import { useState, useEffect } from "react";
import { getCart, updateCart, updateWishlist, getWishlist } from "../utils/storageUtils";

function Cart() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(getWishlist());

  useEffect(() => {
    setCart(getCart());
  }, []);

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCart(updated);
    setCart(updated);
  };

  const toggleWishlist = (item) => {
    const exists = wishlist.some(i => i.id === item.id);
    const updated = exists
      ? wishlist.filter(i => i.id !== item.id)
      : [...wishlist, item];
    updateWishlist(updated);
    setWishlist(updated);
  };

  return (
    <>
      <div className="shopheader">
        <h1>Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="wishlist-empty">
          <p>Your cart is empty</p>
          <a href="/items">Discover More</a>
        </div>
      ) : (
        <div className="bestsellers shop">
          <div className="items">
            {cart.map((item) => (
              <div className="item" key={item.id}>
                <div className="visual">
                  <img src={item.image} alt={item.title} />
                  <button className="quickadd" onClick={() => removeFromCart(item.id)}>
                    <a href="#">Remove</a>
                  </button>
                  <button className="favorite" onClick={() => toggleWishlist(item)}>
                    <a href="#">
                      <i className={`bx bx-heart heart-icon ${wishlist.some(i => i.id === item.id) ? "red" : ""}`}></i>
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

export default Cart;
