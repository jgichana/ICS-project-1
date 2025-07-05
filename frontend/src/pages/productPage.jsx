

import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function ProductListPage({userType, isLoggedIn }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const[searchTerm, setSearchTerm]=useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('http://localhost:8000/products');
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    if (product.unavailable) return;
    setCart(prev => [...prev, product]);
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, unavailable: true } : p));
  };

  const removeFromCart = (index) => {
    const removed = cart[index];
    setCart(prev => prev.filter((_, i) => i !== index));
    setProducts(prev => prev.map(p => p.id === removed.id ? { ...p, unavailable: false } : p));
  };

  return (
    <div className="buyer-container">
      <h2>Furniture Store</h2>
       
      <div className="product-list">
        {products.map(prod => (
          <div key={prod.id} className="product-card">
            <img src={`http://localhost:8000${prod.image_url}`} alt={prod.name} />
            <h4>{prod.name}</h4>
            <p>{prod.description}</p>
            <p>Ksh.{prod.price}</p>
            
           <p style ={{color: prod.unavailable === 0 ? 'green' : 'red' }}> {prod.unavailable ===0 ? 'Available' : 'Unavailable'}</p>
              {isLoggedIn?(
              <div>
                <button className='btn' disabled={prod.unavailable} onClick={()=> addToCart(prod)}>
                {prod.unavailable ? 'In Cart' : 'Add to Cart'}

                </button>
                {/* <p>Seller:{product.seller.name}</p>
                <p>Contact:{product.seller.phone}</p>
                <p>Email:{product.seller.email}</p> */}
              </div>
            ):(
              <Link to="/login" className='btn'>Login to Purchase</Link>
            ) 
            }
            {/* <button disabled={prod.unavailable} onClick={() => addToCart(prod)}>
              {prod.unavailable ? 'In Cart' : 'Add to Cart'}
            </button>  */}
          </div>
        ))}
      {/* ):(
        <p>No products found</p>
      ) */}
      </div>
 </div>
)}
    
      /* <h3>Cart</h3>
      {cart.length === 0 ? <p>Cart is empty</p> : (
        <div className="cart">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <p>{item.name} - ${item.price}</p>
              <button onClick={() => removeFromCart(index)}>Remove</button>
            </div>
          ))}
          <h4>Total: ${cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)}</h4>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      )}*/
 


export default ProductListPage;