import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/authSlice";
import { Link } from "react-router-dom"; // Fixed Link import
import "./Login.css";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [validationError, setValidationError] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

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
      await dispatch(loginUser(credentials));
    }
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
        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder=" "
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>
        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {validationError && <p className="error-message">{validationError}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
