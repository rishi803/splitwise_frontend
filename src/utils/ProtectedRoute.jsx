import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);

  const isAuthenticated= useSelector(state => state.auth.isAuthenticated);


  if (token && isAuthenticated) {
    return children;
   
  }

  return <Navigate to="/login" />;
}

export default ProtectedRoute;
