

// // import React, { useEffect, useState } from 'react';
// // import '../App.css';
// // import { Link } from 'react-router-dom';

// // function ProductListPage({userType, isLoggedIn }) {
// //   const [products, setProducts] = useState([]);
// //   const [cart, setCart] = useState([]);
// //   const[searchTerm, setSearchTerm]=useState('');

// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       const res = await fetch('http://localhost:8000/products');
// //       const data = await res.json();
// //       setProducts(data);
// //     };
// //     fetchProducts();
// //   }, []);

// //   const addToCart = (product) => {
// //     if (product.unavailable) return;
// //     setCart(prev => [...prev, product]);
// //     setProducts(prev => prev.map(p => p.id === product.id ? { ...p, unavailable: true } : p));
// //   };

// //   const removeFromCart = (index) => {
// //     const removed = cart[index];
// //     setCart(prev => prev.filter((_, i) => i !== index));
// //     setProducts(prev => prev.map(p => p.id === removed.id ? { ...p, unavailable: false } : p));
// //   };

// //   return (
// //     <div className="buyer-container">
// //       <h2>Furniture Store</h2>
       
// //       <div className="product-list">
// //         {products.map(prod => (
// //           <div key={prod.id} className="product-card">
// //             <img src={`http://localhost:8000${prod.image_url}`} alt={prod.name} />
// //             <h4>{prod.name}</h4>
// //             <p>{prod.description}</p>
// //             <p>Ksh. {prod.price}</p>
            
// //            <p style ={{color: prod.unavailable === 0 ? 'green' : 'red' }}> {prod.unavailable ===0 ? 'Available' : 'Unavailable'}</p>
// //               {isLoggedIn?(
// //               <div>
// //                 <button className='btn' disabled={prod.unavailable} onClick={()=> addToCart(prod)}>
// //                 {prod.unavailable ? 'In Cart' : 'Add to Cart'}

// //                 </button>
// //                 {/* <p>Seller:{product.seller.name}</p>
// //                 <p>Contact:{product.seller.phone}</p>
// //                 <p>Email:{product.seller.email}</p> */}
// //               </div>
// //             ):(
// //               <Link to="/login" className='btn'>Login to Purchase</Link>
// //             ) 
// //             }
           
// //           </div>
// //         ))}
// //       {/* ):(
// //         <p>No products found</p>
// //       ) */}
// //       </div>
// //  </div>
// // )}
    
// //       /* <h3>Cart</h3>
// //       {cart.length === 0 ? <p>Cart is empty</p> : (
// //         <div className="cart">
// //           {cart.map((item, index) => (
// //             <div key={index} className="cart-item">
// //               <p>{item.name} - ${item.price}</p>
// //               <button onClick={() => removeFromCart(index)}>Remove</button>
// //             </div>
// //           ))}
// //           <h4>Total: ${cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)}</h4>
// //           <button className="checkout-btn">Proceed to Checkout</button>
// //         </div>
// //       )}*/
 


// // export default ProductListPage;


// import React, { useEffect, useState } from 'react';
// import '../App.css';
// import { Link } from 'react-router-dom';
// import {fasearch} from '@fortawesome/free-solid-svg-icons'

// function ProductListPage({ userType, isLoggedIn }) {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(''); // State for the search term

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const res = await fetch('http://localhost:8000/products');
//       const data = await res.json();
//       setProducts(data);
//     };
//     fetchProducts();
//   }, []);

//   const addToCart = (product) => {
//     if (product.unavailable) return; // Ensure product is available
//     setCart(prev => [...prev, product]);
//     // Mark the product as unavailable in the main products list
//     setProducts(prev => prev.map(p => p.id === product.id ? { ...p, unavailable: 1 } : p)); // Set to 1 for unavailable
//   };

//   const removeFromCart = (index) => {
//     const removed = cart[index];
//     setCart(prev => prev.filter((_, i) => i !== index));
//     // Mark the product as available again in the main products list
//     setProducts(prev => prev.map(p => p.id === removed.id ? { ...p, unavailable: 0 } : p)); // Set to 0 for available
//   };

//   // Filtered products based on search term
//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.description.toLowerCase().includes(searchTerm.toLowerCase())
//     // You can add more fields to search, e.g., product.category.name if you fetch category details
//   );

//   return (
//     <div className="buyer-container">
//       <h2>Furniture Store</h2>

//       {/* Search Bar */}
//       <div className="search-bar-wrapper">
//         <input
//           type="text"
//           placeholder="Search products by name or description..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="product-search-input" // Add a class for styling
//         />
//       </div>

//       <div className="product-list">
//         {filteredProducts.length > 0 ? ( // Display message if no products found after filtering
//           filteredProducts.map(prod => (
//             <div key={prod.id} className="product-card">
//               <img src={`http://localhost:8000${prod.image_url}`} alt={prod.name} />
//               <h4>{prod.name}</h4>
//               <p>{prod.description}</p>
//               <p>Ksh. {prod.price}</p>

//               {/* Display availability status */}
//               <p style={{ color: prod.unavailable === 0 ? 'green' : 'red' }}>
//                 {prod.unavailable === 0 ? 'Available' : 'Unavailable'}
//               </p>

//               {isLoggedIn ? (
//                 <div>
//                   <button className='btn' disabled={prod.unavailable === 1} onClick={() => addToCart(prod)}>
//                     {prod.unavailable === 1 ? 'In Cart' : 'Add to Cart'}
//                   </button>
//                   {/* Seller info if needed, uncomment and ensure data is available in prod.seller */}
//                   {/* <p>Seller:{product.seller.name}</p>
//                   <p>Contact:{product.seller.phone}</p>
//                   <p>Email:{product.seller.email}</p> */}
//                 </div>
//               ) : (
//                 <Link to="/login" className='btn'>Login to Purchase</Link>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No products found matching your search.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductListPage;


import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
// import { fasearch } from '@fortawesome/free-solid-svg-icons' // Not used, can be removed if not imported elsewhere

function ProductListPage({ userType, isLoggedIn }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem('shoppingCart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return []; // Return an empty array if there's an error parsing
    }
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Effect to fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8000/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  // Effect to save cart to localStorage whenever the 'cart' state changes
  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cart]); // Dependency array: this effect runs every time 'cart' state updates


  const storedCartItems = JSON.parse(localStorage.getItem('shoppingCart') || '[]');

const productsWithAvailability = data.map(product => {
    const isInCart = storedCartItems.some(cartItem => cartItem.id === product.id);
    return {
        ...product,
        unavailable: isInCart ? 1 : 0 // Set unavailable based on what's in localStorage
    };
});
setProducts(productsWithAvailability);

  const addToCart = (productToAdd) => {
    // Optional: If you want to handle quantity for multiple same items in cart
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === productToAdd.id);

      if (existingItemIndex > -1) {
        // Item already in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity = (updatedCart[existingItemIndex].quantity || 1) + 1;
        return updatedCart;
      } else {
        // Item not in cart, add with quantity 1
        return [...prevCart, { ...productToAdd, quantity: 1 }];
      }
    });

    // Update the main products list's 'unavailable' status (still in memory)
    // Note: If you want this 'unavailable' status to persist across refreshes,
    // you'd need to save it to localStorage too, or fetch product availability from backend.
    // For now, this only affects the current session's display.
    setProducts(prev => prev.map(p => p.id === productToAdd.id ? { ...p, unavailable: 1 } : p));
  };

  const removeFromCart = (idToRemove) => { // Changed to remove by ID for clarity and consistency
    // Find the item being removed from the cart to get its original ID
    const removedItem = cart.find(item => item.id === idToRemove);

    setCart(prevCart => {
      // Logic for removing: if quantity > 1, decrement; else, remove entirely
      const existingItem = prevCart.find(item => item.id === idToRemove);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === idToRemove ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevCart.filter(item => item.id !== idToRemove);
      }
    });

    // Mark product as available in the display list, if it was indeed removed
    if (removedItem) { // Only update if an item was actually found and removed
        setProducts(prev => prev.map(p => p.id === removedItem.id ? { ...p, unavailable: 0 } : p));
    }
  };


  // Filtered products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="buyer-container">
      <h2>Furniture Store</h2>

      {/* Search Bar */}
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
                    disabled={prod.unavailable === 1} // Disable if unavailable is 1
                    onClick={() => addToCart(prod)}
                  >
                    {prod.unavailable === 1 ? 'In Cart' : 'Add to Cart'}
                  </button>
                </div>
              ) : (
                <Link to="/login" className='btn'>Login to Purchase</Link>
              )}
            </div>
          ))
        ) : (
          <p>No products found matching your search.</p>
        )}
      </div>

      
      {/* <h3>Cart ({cart.length} items)</h3>
      {cart.length === 0 ? <p>Cart is empty</p> : (
        <div className="cart-summary">
          {cart.map((item) => (
            <div key={item.id} className="cart-item-display">
              <p>{item.name} - Ksh. {item.price} x {item.quantity || 1}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove </button>
            </div>
          ))}
          <h4>Total: Ksh. {cart.reduce((sum, item) => sum + parseFloat(item.price * (item.quantity || 1)), 0).toFixed(2)}</h4>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      )}
      */}
    </div>
  );
}

export default ProductListPage;