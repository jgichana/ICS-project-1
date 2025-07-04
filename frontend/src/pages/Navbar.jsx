import React, { useState } from "react";
import { Link } from 'react-router-dom';
 import cartIcon from '../assets/cartIcon.png';
 import { useCart } from "./CartContext";

function Navbar({isLoggedIn, handleLogout}) {
  const [menu, setMenu] = useState("Home");
  const {itemCount}=useCart();



  return (
    <nav>
    <div className="container">
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
          {isLoggedIn?(
            <button onClick={handleLogout} className="btn">Logout</button>
          ):(
            <Link to='/login' onClick={() => setMenu("Login")} className={`btn-signup ${menu === "Login" ? "active" : ""}`}>Sign Up</Link>
          )}
          </li>
          <li>
          <Link to="/seller" onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>
            Sell an item
          </Link>
        </li>
        {isLoggedIn && (<li> <Link to="/cart" onClick={() =>setMenu("Cart")} className={menu==="Cart"? 'active':""}>
        <img src={cartIcon} alt="Cart" className="cart-icon"/>
        {itemCount>0 && <span className="cart-count">{itemCount}</span>}
  </Link></li>)}
        </ul>
        </div>
    </nav>
  );
};

export default Navbar;
