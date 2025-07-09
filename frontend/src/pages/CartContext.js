import React, { createContext, useContext, useState, useEffect } from "react"; // <-- Import useEffect

const CartContext = createContext(); // Create a context for the cart

export const useCart = () => {
    return useContext(CartContext);
};

// CartProvider component to wrap around the application
export const CartProvider = ({ children }) => {
    // --- 1. INITIALIZE state from localStorage ---
    const [cartItems, setCartItems] = useState(() => {
        try {
            // Attempt to retrieve cart from localStorage
            const storedCart = localStorage.getItem('shoppingCart');
            // Parse it if it exists, otherwise return an empty array
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            // Log any errors during parsing (e.g., malformed JSON)
            console.error("CartContext: Failed to parse cart from localStorage on initialization:", error);
            // Return an empty array to prevent app crash if localStorage is corrupted
            return [];
        }
    });

    // itemCount should be derived from cartItems, not separately persisted or set
    // It should represent the total number of *unique* items in the cart (if you use cartItems.length)
    // or the *sum of quantities* if you want that.
    // Let's make it the count of unique items for now, based on your current usage.
    const [itemCount, setItemCount] = useState(0);

    // --- 2. useEffect to SAVE cartItems to localStorage and update itemCount ---
    useEffect(() => {
        try {
            // Save the current cartItems array to localStorage whenever it changes
            localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
            // Update itemCount based on the current state of cartItems
            // If itemCount is meant to be the *number of unique items*:
            setItemCount(cartItems.length);
            // If itemCount is meant to be the *sum of all quantities*:
            // setItemCount(cartItems.reduce((total, item) => total + item.quantity, 0));

        } catch (error) {
            console.error("CartContext: Error saving cart to localStorage:", error);
        }
    }, [cartItems]); // This effect runs every time 'cartItems' changes

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                // If item is already in cart, increment quantity
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item with quantity 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
        // Note: setItemCount is now handled by the useEffect above,
        // so you don't need setItemCount(prevCount => prevCount+1) here.
    };

    const removeFromCart = (idToRemove) => {
        setCartItems(prevCart => { // prevCart here refers to the current cartItems state
            const existingItem = prevCart.find(item => item.id === idToRemove);

            // This logic allows for decrementing quantity if > 1, otherwise removing entirely.
            // If your products should always have quantity 1 in the cart, you can simplify.
            if (existingItem && existingItem.quantity > 1) {
                console.log(`CartContext: Decrementing quantity for item ID: ${idToRemove}.`); // DEBUG
                return prevCart.map(item =>
                    item.id === idToRemove ? { ...item, quantity: item.quantity - 1 } : item
                );
            } else {
                console.log(`CartContext: Completely removing item ID: ${idToRemove}.`); // DEBUG
                // If quantity is 1 (or less), or if you just want to remove completely, filter the item out
                return prevCart.filter(item => item.id !== idToRemove);
            }
        });
    };

    const clearCart = () => {
        setCartItems([]);
        // setItemCount(0); // This is now handled by the useEffect watching cartItems
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, itemCount }}>
            {children} {/* Render child components */}
        </CartContext.Provider>
    );
};

export default CartContext;