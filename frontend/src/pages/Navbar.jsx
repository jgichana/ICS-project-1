import React, { useState } from "react";
import { Link } from 'react-router-dom';
// import cartIcon from '../assets/cartIcon.png';
function Navbar({isLoggedIn, handleLogout}) {
  const [menu, setMenu] = useState("Home");

  return (
    <nav className="container">
      <ul>
        <li>
          <Link to="/" onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/products" onClick={() => setMenu("Listings")} className={menu === "Listings" ? "active" : ""}>
            Listings
          </Link>
        </li>
        <li>
          {isLoggedIn ? (
        <button onClick={handleLogout}>Sign Out</button>
      ) : (
        <Link to="/login">Sign In</Link>
      )}        </li>
<li>
          <Link to="/seller" onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>
            Sell an item
          </Link>
        </li>

      {/* <div className="cart-wrapper">
        <Link to="/cart" className="cart-wrapper">
        <img src={cartIcon} alt="cart" className="cart-icon" />
        {cart.length > 0 && (
          <div className="nav-cart-count">{cart.length}</div>
        )}
</Link>

      </div> */}
        </ul>
    </nav>
  );
};

export default Navbar;
