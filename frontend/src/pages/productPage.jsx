// src/pages/ProductListPage.js

import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext'; // <-- VERIFY THIS PATH IS CORRECT!

function ProductListPage({ userType, isLoggedIn }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- CORRECT: Get ONLY cartItems and the add/remove functions from the context ---
  const { cartItems, addToCart, removeFromCart } = useCart();

  // --- REMOVE THE LOCAL [cart, setCart] STATE AND ITS RELATED USEEFFECTS ---
  // const [cart, setCart] = useState(() => { ... }); // DELETE THIS
  // useEffect(() => { localStorage.setItem('shoppingCart', JSON.stringify(cart)); ... }, [cart]); // DELETE THIS

  // --- CORRECTED useEffect for fetching products and managing availability ---
  useEffect(() => {
    const fetchAndProcessProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:8000/products');

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText}`);
        }

        const fetchedProducts = await res.json();

        // --- Use cartItems from the context to determine availability ---
        const productsWithAvailability = fetchedProducts.map(product => {
          // Check if the product's ID exists in the GLOBAL cartItems array
          const isInCart = cartItems.some(cartItem => cartItem.id === product.id);
          return {
            ...product,
            unavailable: isInCart ? 1 : 0 // Set unavailable based on current cartItems
          };
        });

        setProducts(productsWithAvailability);
      } catch (err) {
        console.error("Error fetching or processing products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessProducts();
  }, [cartItems]); // <-- CRITICAL: This effect now re-runs whenever cartItems from context changes!

  // --- REMOVE THE LOCAL addToCart and removeFromCart FUNCTIONS ---
  // const addToCart = (productToAdd) => { ... }; // DELETE THIS
  // const removeFromCart = (idToRemove) => { ... }; // DELETE THIS

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-message">Loading products...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="buyer-container">
      <h2>Furniture Store</h2>

      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="Search products by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="product-search-input"
        />
      </div>

      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(prod => (
            <div key={prod.id} className="product-card">
              <img src={`http://localhost:8000${prod.image_url}`} alt={prod.name} />

              <h4>{prod.name}</h4>
              <p>{prod.description}</p>
              <p>Ksh. {prod.price}</p>

              <p style={{ color: prod.unavailable === 0 ? 'green' : 'red' }}>
                {prod.unavailable === 0 ? 'Available' : 'Unavailable'}
              </p>

              {isLoggedIn ? (
                <div>
                  <button
                    className='btn'
                    disabled={prod.unavailable === 1} // Disable if already in cart
                    // --- CALL THE GLOBAL addToCart FROM THE CONTEXT ---
                    onClick={() => addToCart(prod)}
                  >
                    {prod.unavailable === 1 ? 'In Cart' : 'Add to Cart'}
                  </button>
                  {/* Optional: If you want to remove directly from product list */}
                  {/* {prod.unavailable === 1 && (
                      <button
                          className='btn-remove'
                          onClick={() => removeFromCart(prod.id)} // Call global removeFromCart
                      >
                          Remove from Cart
                      </button>
                  )} */}
                </div>
              ) : (
                <Link to="/login" className='btn'>Login to Purchase</Link>
              )}
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;