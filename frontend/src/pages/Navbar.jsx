import React, { useState } from "react";
import { Link } from 'react-router-dom';
 import cartIcon from '../assets/cartIcon.png';
 import { useCart } from "./CartContext";

function Navbar({isLoggedIn, handleLogout,user}) {
  const [menu, setMenu] = useState("Home");
  const {getItemCount}=useCart();
  const itemCount=getItemCount();
  
console.log('Navbar user:', user);
console.log('User type:', user?.userType);
console.log('Is seller:', user?.userType === 'seller');



  return (

    <nav>
    <div className="container">
      <ul>
        <li>
          <Link to="/" onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>
            Home
          </Link>
        </li>
        {user?.userType!=='admin'&&(
        <li>
          <Link to="/products" onClick={() => setMenu("Listings")} className={menu === "Listings" ? "active" : ""}>
            Listings
          </Link>
        </li>
        )}
        {user?.userType==='admin'&&(
          <li>
            <Link to="/admin" onClick={() => setMenu("Admin")} className={menu === "Admin" ? "active" : ""}>
                Admin Dashboard
              </Link>
          </li>
        )}
        <li>
          {isLoggedIn ? (
            <Link to ="/login"> <button className="btn" onClick={handleLogout}>Sign Out</button>
</Link>
      ) : (
        <Link to="/login" > <button className="btn">Sign In</button></Link>
      )}
      </li> 
      {user?.userType === 'seller' && (     
          <li>
            <Link
              to="/seller"
              onClick={() => setMenu("Seller")}
              className={menu === "Seller" ? "active" : ""}
            >
              Sell an item
            </Link>
          </li>
      )}
        {isLoggedIn && user?.userType !== 'admin' &&
        
        (<li> <Link to="/cart" onClick={() =>setMenu("Cart")} className={menu==="Cart"? 'active':""}>
          <div className="cart-container">
        <img src={cartIcon} alt="Cart" className="cart-icon"/>
        {itemCount>0 && <span className="cart-count">{itemCount}</span>}
  </div>
  </Link></li>)}
  
      
        </ul>
        </div>
    </nav>
  );
};

export default Navbar;
