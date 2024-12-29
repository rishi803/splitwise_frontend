import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Splitwise
      </div>
      <div className="navbar-buttons">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="nav-button logout-button">
            Logout
          </button>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="nav-button">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="nav-button">
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;