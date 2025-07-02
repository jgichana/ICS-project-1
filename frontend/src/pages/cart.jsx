// // src/context/CartContext.js
// import React, { createContext, useContext, useState } from 'react';

// const CartContext = createContext();

// export function useCart() {
//   return useContext(CartContext);
// }

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState([]);

//   const addToCart = (product) => {
//     setCart((prev) => [...prev, product]);
//   };

//   const removeFromCart = (productId) => {
//     setCart((prev) => prev.filter((item) => item.id !== productId));
//   };

//   const isInCart = (productId) => {
//     return cart.some((item) => item.id === productId);
//   };

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export default CartPage;
