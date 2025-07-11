import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCart, updateCart, getWishlist, updateWishlist } from "../utils/storageUtils";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(getCart());
  const [wishlist, setWishlist] = useState(getWishlist());

  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(`http://localhost:5000/items/${id}`)
      .then((res) => {
        console.log("Fetched item:", res.data);
        if (res.data) {
          setItem(res.data);
        } else {
          setItem(null);
          setError("Item not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching item:", err);
        setError("Failed to load item. Please try again.");
        setItem(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const isInCart = () => cart.some((i) => i.id === item?.id);
  const isInWishlist = () => wishlist.some((i) => i.id === item?.id);

  const toggleCart = () => {
    if (!item) return;
    let updated;
    if (isInCart()) {
      updated = cart.filter((i) => i.id !== item.id);
    } else {
      updated = [...cart, item];
    }
    updateCart(updated);
    setCart(updated);
  };

  const toggleWishlist = () => {
    if (!item) return;
    let updated;
    if (isInWishlist()) {
      updated = wishlist.filter((i) => i.id !== item.id);
    } else {
      updated = [...wishlist, item];
    }
    updateWishlist(updated);
    setWishlist(updated);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!item) return <p>Item not found.</p>;

  return (
    <div className="item-part">
      <div className="title">
        <p>{item.title}</p>
      </div>
      <div className="content">
        <div className="visual">
          <img src={item.image} alt={item.title} />
        </div>
        <div className="details">
          <div className="details-title">
            <p>{item.category || "Curl talk"}</p>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
          </div>
          <div className="details-about">
            <p>{item.description}</p>
            <h1>${item.price.toFixed(2)}</h1>
          </div>
          <div className="details-button">
            <button onClick={toggleCart}>
              {isInCart() ? "Remove from Cart" : "Add To Cart"}
            </button>
            <button onClick={toggleWishlist}>
              {isInWishlist() ? "Remove from Wishlist" : "Add To Wishlist ♡"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
