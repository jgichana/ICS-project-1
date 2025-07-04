import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../App.css' 
// import cartIcon from '../assets/cartIcon.png';
function Navbar({isLoggedIn, handleLogout, user}) {
  const [menu, setMenu] = useState("Home");

  return (
    <nav className="nav-container">
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
            <Link to ="/login"> <button onClick={handleLogout}>Sign Out</button>
</Link>
      ) : (
        <Link to="/login"> <button>Sign In</button></Link>
      )}
      </li>      
          <li>
            <Link
              to="/seller"
              onClick={() => setMenu("Seller")}
              className={menu === "Seller" ? "active" : ""}
            >
              Sell an item
            </Link>
          </li>
      
  
      
        </ul>
    </nav>
  );
};

export default Navbar;
