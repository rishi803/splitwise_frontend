import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, clearError } from "../../features/authSlice";
import { Link, useNavigate } from "react-router-dom"; 
import "./Signup.css";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { loading, error, token } = useSelector((state) => state.auth);

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [validationError, setValidationError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Clear errors on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Navigate to login after successful registration
  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [isRegistered]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const validateForm = () => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!userInfo.username || !userInfo.email || !userInfo.password) {
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
      const res= await dispatch(signupUser(userInfo));

      console.log("registered data ",res);
      if (res.meta.requestStatus === "fulfilled") {
        setIsRegistered(true);
        console.log("User successfully registered!");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="login-signup-form">
        <h2>Signup</h2>
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder=" "
            value={userInfo.username}
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
        <div className="input-group password-group">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder=" "
            value={userInfo.password}
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
        <p style={{ fontSize: "18px" }}>
          Already have an account?{" "}
          <Link to="/login">
            <p
              style={{
                fontSize: "18px",
                color: "#002aff",
              }}
            >
              Login
            </p>
          </Link>
        </p>
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
        {validationError && <p className="error-message">{validationError}</p>}
        {error && <span className="error-message">{error}</span>}
        {isRegistered && (
          <p className="success-message">User registered successfully! Redirecting...</p>
        )}
      </form>
    </div>
  );
}

export default Signup;
