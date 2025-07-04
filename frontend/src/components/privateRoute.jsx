 import React from 'react';
  import { Navigate, Outlet } from 'react-router-dom';

  function PrivateRoute({ userType }) {
    return userType ? <Outlet /> : <Navigate to="/login" replace />;
  }
  export default PrivateRoute;