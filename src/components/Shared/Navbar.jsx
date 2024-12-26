import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../../features/authSlice';
import './Navbar.css'
import { Link } from "react-router";

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login"; 
  };

  return (
    <div className="navbar">
     
      <div className="navbar-left">
        <h1 className="app-name">Splitwise</h1>
      </div>

     
      <div className="navbar-right">
        {isAuthenticated ? (
          <button className="btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
          
                <Link to='/login'><button className="btn login-btn">Login </button></Link>
              
              <Link to='/signup'><button className="btn signup-btn">Signup</button></Link>
          
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
