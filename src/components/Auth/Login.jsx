import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../features/authSlice";
import { Link, useNavigate } from "react-router-dom"; 
import "./Login.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [validationError, setValidationError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false); // To handle redirection delay

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Clear errors when the component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle 2-second delay before redirecting
  useEffect(() => {
    if (isLoginSuccess) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [isLoginSuccess, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const validateForm = () => {
    if (!credentials.email || !credentials.password) {
      setValidationError("Both fields are required.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const res = await dispatch(loginUser(credentials));

      if (res.meta.requestStatus === "fulfilled") {
        setIsLoginSuccess(true); // Delay redirection
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="login-signup-form">
        <h2>Login</h2>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder=" "
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <label>Email</label>
        </div>
        <div className="input-group password-group">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder=" "
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <span
            className={`eye-icon ${passwordVisible ? "visible" : ""}`}
            onClick={togglePasswordVisibility}
          >
            👁️
          </span>
        </div>
        <p>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#002aff" }}>
            Signup
          </Link>
        </p>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {validationError && <p className="error-message">{validationError}</p>}
        {error && <p className="error-message">{error}</p>}
        {isLoginSuccess && (
          <p className="success-message">Login successful! Redirecting...</p>
        )}
      </form>
    </div>
  );
}

export default Login;
