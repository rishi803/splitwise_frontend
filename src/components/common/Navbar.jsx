
import {useState} from 'react';
import { useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {  FaRegUserCircle } from "react-icons/fa";
import UserSidebar from './Sidebar.jsx';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();


  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={()=> navigate('/dashboard?page=1')}>
        Splitwise
      </div>
      <div className="navbar-buttons">
        {isAuthenticated ? (
          <button onClick={() => setSidebarOpen(true)} className="user-profile-button">
            <FaRegUserCircle className="nav-icon" />
            <span>Profile</span>
          </button>
        ) : (
          <>
            {/* <button onClick={() => navigate('/login')} className="nav-button">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="nav-button">
              Sign Up
            </button> */}
          </>
        )}
      </div>

      {
        sidebarOpen && <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      }
    </nav>
  );
};

export default Navbar;