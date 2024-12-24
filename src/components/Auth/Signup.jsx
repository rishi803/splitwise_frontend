import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../features/authSlice";
import { Link } from "react-router-dom"; // Corrected import
import "./Signup.css";

function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [validationError, setValidationError] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const validateForm = () => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!userInfo.name || !userInfo.email || !userInfo.password) {
      setValidationError("All fields are required.");
      return false;
    }
    if (!passwordRegex.test(userInfo.password)) {
      setValidationError(
        "Password must be at least 8 characters long, include at least one letter, one number, and one special character."
      );
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await dispatch(signupUser(userInfo));
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="login-signup-form">
        <h2>Signup</h2>
        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder=" "
            value={userInfo.name}
            onChange={handleChange}
            required
          />
          <label>Name</label>
        </div>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder=" "
            value={userInfo.email}
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
            value={userInfo.password}
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
        {validationError && <p className="error-message">{validationError}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default Signup;
