import React from "react";
import {useCart} from './CartContext';
import {Link} from 'react-router-dom'
import '../App.css'

function Cart(){
    const {cartItems, removeFromCart, clearCart}=useCart();
    return(
        <div className="cart-container">
            <h2>Your Cart</h2>
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

            )}
        </div>
    )
}
export default Cart;