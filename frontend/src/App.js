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
// import BuyerProductPage from './pages/buyerPage';
import Navbar from './pages/Navbar';
import ProductListPage from './pages/productPage';
import CartPage from './pages/cart';
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));
  const userType = localStorage.getItem('userType');  

  const LoginSuccess = (userId, userType) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userType', userType);
    setIsLoggedIn(true); 
  };

  const handleLogout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userType');
  setIsLoggedIn(false);
};

  
  useEffect(() => {
    const userId = localStorage.getItem('userId'); 
       if (userId) {
    
      setIsLoggedIn(true);
    }
  }, []); 

  return (
    <div className="app-container">
      <BrowserRouter>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/form" element={<ProductUploadForm />} />
         <Route path="/Cart" element={<CartPage/>}/>
          <Route path="/login" element={isLoggedIn ? (
                userType === 'seller' ? (
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
       
          <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/itemDisplay" element={<ItemDisplay />} />
          </Route>
          {/* <Route path="/buyer" element={<BuyerProductPage />} /> */}
        <Route path="/seller" element={<SellerProductPage userId={localStorage.getItem('userId')} />} />
      
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
