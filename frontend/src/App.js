import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './Login';
import Register from './Register';
import ProductUploadForm from './pages/form';
import Homepage from './pages/homepage';
import PrivateRoute from './components/privateRoute';
import SellerProductPage from './pages/sellerPage';
import Navbar from './pages/Navbar';
import ProductListPage from './pages/productPage';
import CartPage from './pages/cart';
import PaymentForm from './pages/paymentForm';
import { CartProvider } from './pages/CartContext';
import AdminDash from './pages/AdminDash';

function App() {
  const [isRegistered,setIsRegistered] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));
  const [user,setUser]= useState(()=> {
  const storedType = localStorage.getItem('userType'); 
  const storedId = localStorage.getItem('userId');
  const storedName=localStorage.getItem('userName');
  console.log('stored user data:',{storedType,storedId,storedName });
  
    return storedId && storedType? {
    id :storedId,
    userType:storedType,
    name:storedName,
    isSeller:storedType==='seller',
    isAdmin:storedType==='admin'
  }: null;
});
  
  console.log("user", user);
  console.log("isLoggedIn", isLoggedIn);
  const LoginSuccess = (userId, userType,userName) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userName', userName);
     setUser({
    id: userId,
    userType: userType,
    name:userName,
    isSeller: userType === 'seller',
    isAdmin:userType==='admin'
  });
    setIsLoggedIn(true); 
  };

  const handleLogout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userType');
  localStorage.removeItem('userName');
  setUser(null);
  setIsLoggedIn(false);
};

    useEffect(() => {
    const userId = localStorage.getItem('userId'); 
       if (userId) {
          setIsRegistered(true);
          setIsLoggedIn(true);
    }
  }, []); 
  
  useEffect(() => {
    const userId = localStorage.getItem('userId'); 
       if (userId) {
          setIsLoggedIn(true);
    }
  }, []); 

  return (
    <CartProvider>
    <div className="app-container">
      <BrowserRouter>
            <Navbar isLoggedIn={!!user} user={user} handleLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<ProductListPage userType="buyer" isLoggedIn={isLoggedIn} />} />
          <Route path="/form" element={<ProductUploadForm />} />
         <Route path="/cart" element={<CartPage/>}/>
          <Route path="/pay" element={<PaymentForm/>}/>


          <Route
  path="/login"
  element={
    isLoggedIn ? (
      user?.userType === 'seller' ? (
        <Navigate to="/seller" replace />
      ) : user?. userType==='admin'? (
        <Navigate to ='/admin' replace />
      ):(
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
        <Route path="/seller" element={ isLoggedIn && user?.userType==='seller' ?(<SellerProductPage userId={user.id}/>): 
        (  <Navigate to="/login" replace />
    )}/>
    <Route path='/admin'
    element={
      isLoggedIn && user?. userType==='admin'?(
        <AdminDash/>
      ):(
        <Navigate to='/login'replace/>
      )
    }
    />
          </Routes>
      </BrowserRouter>
    </div>
    </CartProvider>
  );
}

export default App;