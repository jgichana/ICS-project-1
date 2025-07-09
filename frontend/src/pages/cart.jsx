// src/pages/Cart.js

import React from 'react'; // No need for useState here anymore
import { useCart } from './CartContext'; // <-- VERIFY THIS PATH IS CORRECT!
import { Link } from 'react-router-dom';
import '../App.css'; // Your CSS file

function Cart() {
  // --- CORRECT: Destructure everything from useCart() hook ---
  // This cartItems, removeFromCart, clearCart, and itemCount are the GLOBAL, PERSISTENT ones.
  const { cartItems, removeFromCart, clearCart, itemCount } = useCart();

  // The 'products' state and its 'setProducts' function you had locally are NOT needed here.
  // The 'unavailable' status will be handled by your ProductListPage's useEffect
  // because that useEffect listens to changes in cartItems (from the context).

  const calculateTotal = () => {
    // Use cartItems from context
    return cartItems.reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      {/* Use itemCount from context */}
      <h3>Cart ({itemCount} items)</h3>
      {/* Use cartItems.length from context */}
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link to="/products">Go shopping!</Link></p>
      ) : (
        <div className="cart-summary">
          {/* Map over cartItems from context */}
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-display">
              <div className="product-card">
                <img
                  src={`http://localhost:8000${item.image_url}`}
                  alt={item.name}
                  className="cart-product-image"
                />
              </div>
              <p>{item.name} - Ksh. {item.price} x {item.quantity || 1}</p>
              {/* --- CALL removeFromCart FROM THE CONTEXT --- */}
              <button className='cancel' onClick={() => removeFromCart(item.id)}>Remove </button>
            </div>
          ))}
          <h4>Total: Ksh. {calculateTotal()}</h4>
          {/* --- CALL clearCart FROM THE CONTEXT --- */}
          <button className="btn" onClick={clearCart}>Clear Cart</button>
          <Link to='/pay'><button className="btn">Proceed to Checkout</button></Link>
        </div>
      )}
    </div>
  );
}

export default Cart;