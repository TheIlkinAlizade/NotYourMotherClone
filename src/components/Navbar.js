import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../images/logo.png";
import { getUser, logoutUser } from "../utils/storageUtils";

function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/items?search=${encodeURIComponent(search)}`);
      setSearch("");
      setShowSearch(false);
      setShowMobileMenu(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="navbar">
      <div className="links">
        <ul>
            <li><Link to="/items">Shop</Link></li>
            <li><Link to={`/items?category=${encodeURIComponent("Curl Talk")}`}>Curl Talk</Link></li>
            <li><Link to={`/items?category=${encodeURIComponent("Best Sellers")}`}>Best Sellers</Link></li>
            <li><Link to={`/items?category=${encodeURIComponent("New")}`}>New</Link></li>
            <li><Link to={`/items?category=${encodeURIComponent("Rewards")}`}>Rewards</Link></li>
        </ul>
      </div>

      <div className="logo">
        <Link to="/"><img src={logo} alt="logo" /></Link>
      </div>

      <div className="links links2">
        <ul>
          <li><a href="#">About Us</a></li>
          <li>
            <button className="search-toggle" onClick={() => setShowSearch(!showSearch)}>
              <i className="bx bx-search"></i>
            </button>
          </li>

          {user ? (
            <li>
              <Link to="/profile" title={`Logged in as ${user.username}`}>
                <i className="bx bx-user-circle"></i>
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/auth">
                <i className="bx bx-user-circle"></i>
              </Link>
            </li>
          )}

          <li><Link to="/wishlist"><i className="bx bx-heart"></i></Link></li>
          <li><Link to="/cart"><i className="bx bx-shopping-bag"></i></Link></li>
        </ul>

        {showSearch && (
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Go</button>
          </form>
        )}
      </div>

      {/* Hamburger for mobile */}
      <button className="hamburger" onClick={toggleMobileMenu}>
        ☰
      </button>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
            <Link to="/items" className="link" onClick={toggleMobileMenu}>Shop</Link>
            <Link to="/items?category=Curl%20Talk" className="link" onClick={toggleMobileMenu}>Curl Talk</Link>
            <Link to="/items?category=Best%20Sellers" className="link" onClick={toggleMobileMenu}>Best Sellers</Link>
            <Link to="/items?category=New" className="link" onClick={toggleMobileMenu}>New</Link>
            <Link to="/items?category=Rewards" className="link" onClick={toggleMobileMenu}>Rewards</Link>
          <a href="#" className="link" onClick={toggleMobileMenu}>About Us</a>
            
          {/* Actual search form for mobile */}
          <form onSubmit={handleSearch} className="mobile-search-form">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Go</button>
          </form>

          {user ? (
            <>
              <Link to="/profile" className="link" onClick={toggleMobileMenu}>
                <i className="bx bx-user-circle"></i> Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="link" onClick={toggleMobileMenu}>
              <i className="bx bx-user-circle"></i> Login/Register
            </Link>
          )}
          <Link to="/wishlist" className="link" onClick={toggleMobileMenu}>
            <i className="bx bx-heart"></i> Wishlist
          </Link>
          <Link to="/cart" className="link" onClick={toggleMobileMenu}>
            <i className="bx bx-shopping-bag"></i> Cart
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
