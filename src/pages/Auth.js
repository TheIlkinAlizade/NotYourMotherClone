import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getCart,
  getWishlist,
  updateCart,
  updateWishlist,
  setUser,
} from "../utils/storageUtils";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      if (isLogin) {
        // LOGIN: fetch users, find matching user
        const res = await axios.get(`http://localhost:5000/users?username=${encodeURIComponent(form.username)}`);
        const users = res.data;
        const user = users.find(u => u.password === form.password);

        if (user) {
          setUser(user);
          navigate("/");
        } else {
          setError("Invalid username or password");
        }
      } else {
        // REGISTER: check if username exists
        const res = await axios.get(`http://localhost:5000/users?username=${encodeURIComponent(form.username)}`);
        const users = res.data;

        if (users.length > 0) {
          setError("Username already exists");
          return;
        }

        // Add new user
        const newUser = { username: form.username, password: form.password };
        const createRes = await axios.post("http://localhost:5000/users", newUser);

        // On success, save user and cart/wishlist if needed
        const guestCart = getCart();
        const guestWishlist = getWishlist();
        setUser(createRes.data);
        updateCart(guestCart);
        updateWishlist(guestWishlist);
        navigate("/");
      }
    } catch (err) {
      setError("Server error, please try again later");
      console.error(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>{isLogin ? "Login to your account" : "Create an account"}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p
          className="auth-toggle"
          onClick={() => {
            setError("");
            setIsLogin(!isLogin);
          }}
        >
          {isLogin
            ? "Don’t have an account? Register here"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

export default Auth;
