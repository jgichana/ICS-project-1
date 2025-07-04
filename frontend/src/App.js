import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './Login';
import Register from './Register';
import ProductUploadForm from './pages/form';
import Homepage from './pages/homepage';
import ItemDisplay from './pages/itemDisplay';
import PrivateRoute from './components/privateRoute';
import SellerProductPage from './pages/sellerPage';
import Navbar from './pages/Navbar';
import ProductListPage from './pages/productPage';
import CartPage from "./pages/cart"
function App() {
  const [isRegistered,setIsRegistered] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));
  const [user,setUser]= useState(()=> {
  const storedType = localStorage.getItem('userType'); 
  const storedId = localStorage.getItem('userId');
  
    return storedId && storedType? {
    id :storedId,
    type:storedType,
    isSeller:storedType==='seller'
  }: null;
});
  
  console.log("user", user);
  console.log("isLoggedIn", isLoggedIn);
  const LoginSuccess = (userId, userType) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userType', userType);
     setUser({
    id: userId,
    type: userType,
    isSeller: userType === 'seller',
  });
    setIsLoggedIn(true); 
  };

  const handleLogout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userType');
  setUser(null);
  setIsLoggedIn(false);
};

    useEffect(() => {
    const userId = localStorage.getItem('userId'); 
       if (userId) {
          setIsRegistered(true);
    }
  }, []); 
  
  useEffect(() => {
    const userId = localStorage.getItem('userId'); 
       if (userId) {
          setIsLoggedIn(true);
    }
  }, []); 

  return (
    <div className="app-container">
      <BrowserRouter>
            <Navbar isLoggedIn={!!user} user={user} handleLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<ProductListPage userType="buyer"/>} />
          <Route path="/form" element={<ProductUploadForm />} />
         <Route path="/cart" element={<CartPage/>}/>
          <Route
  path="/login"
  element={
    isLoggedIn ? (
      user?.type === 'seller' ? (
        <Navigate to="/seller" replace />
      ) : (
        <Navigate to="/products" replace />
      )
    ) : (
      <Login onLoginSuccess={LoginSuccess} />
    )
  }
/>
           
          <Route path="/register" element={isLoggedIn ? (
                <Navigate to="/login"  /> 
              ) : (

                <Register onRegisterSuccess={LoginSuccess} />
              )
            }
          />
       
          {/* <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/itemDisplay" element={<ItemDisplay />} />
          </Route> */}
        <Route path="/seller" element={ isLoggedIn  ?(<SellerProductPage userId={user.id}/>): 
        (  <Navigate to="/login" replace />
    )}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
