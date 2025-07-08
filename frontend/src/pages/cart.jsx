import {useCart} from './CartContext';
import {Link} from 'react-router-dom'
import '../App.css'
import { useState } from 'react';

function Cart(){
    const {cartItems, removeFromCart, clearCart}=useCart();
    const [cart, setCart] = useState(() => {
        try {
          const storedCart = localStorage.getItem('shoppingCart');
          return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error);
          return []; // Return an empty array if there's an error parsing
        }
      });
    return(
        <div className="cart-container">
            {/* <h2>Your Cart</h2>
            {cartItems.length===0 ?(
                <>
                <p>Your cart is empty.</p>
                <Link to='/pay'><button className="btn" >Checkout and Pay</button></Link>
                </>
                
            ):(
                <div>
                    <ul>
                        {cartItems.map(item=>(
                            <li key={item.id}>
                                <img src={item.image_url} alt={item.name} />
                                <span>{item.name}</span>
                                <span>KES{item.price}</span>
                                <button onClick={()=>removeFromCart(item.id)}>Remove</button>

                                
                            </li>
                        ))}
                      
                        <button onClick={clearCart}>Clear Cart</button>
                    </ul>
                </div>

            )} */}

              <h3>Cart ({cart.length} items)</h3>
      {cart.length === 0 ? <p>Cart is empty</p> : (
        <div className="cart-summary">
          {cart.map((item) => (
            <div key={item.id} className="cart-item-display">
                <div className="product-card">
            <img
        src={`http://localhost:8000${item.image_url}`}      
        alt={item.name}  
              className="cart-product-image" 
            />
          </div>
              <p>{item.name} - Ksh. {item.price} x {item.quantity || 1}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove </button>
            </div>
          ))}
          <h4>Total: Ksh. {cart.reduce((sum, item) => sum + parseFloat(item.price * (item.quantity || 1)), 0).toFixed(2)}</h4>
                <Link to='/pay'><button className="btn" >Checkout and Pay</button></Link>
        </div>
      )}
        </div>
    )
}
export default Cart;