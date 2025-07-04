import React,{createContext,useContext, useState}from "react";

const CartContext=createContext(); //create a context for the cart

export const useCart=()=>{
    return useContext(CartContext); 
};
//cartprovider component to wrap around the application
export const CartProvider=({children})=>{
    const [cartItems, setCartItems]=useState([]);
     const[itemCount,setItemCount]=useState(0);


    const addToCart=(product)=>{
        setCartItems((prevItems)=>{
            const existingItem=prevItems.find(item => item.id===product.id);
            if(existingItem){
                return prevItems.map(item =>
                    item.id===product.id
                    ?{...item,quantity:item.quantity+1}
                    :item
                )

            } else{
                setItemCount(prevCount =>prevCount+1);
                return [...prevItems,{...product,quantity:1}]
            }
        });
    };

    const removeFromCart=(productId) =>{
        setCartItems((prevItems)=>{
            const updatedItems=prevItems.filter(item=>item.id!==productId);
            setItemCount(updatedItems.length);
            return updatedItems;
        });
    }

    const clearCart=() =>{
        setCartItems([]);
        setItemCount(0);
    }

return(
    <CartContext.Provider value={{cartItems, addToCart,removeFromCart,clearCart,itemCount}}>
        {children} {/*render child components */}
    </CartContext.Provider>
)
}

export default CartContext;
