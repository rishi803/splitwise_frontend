import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signupSchema } from "../utils/validation";
import api from "../utils/api";
import "../styles/FormStyles.css";

const Signup = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);

  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await api.post("/auth/signup", values);
      navigate("/login");
    } catch (error) {
      setServerError(error.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        {serverError && <div className="error-message">{serverError}</div>}
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <Field
                  type="text"
                  name="name"
                  placeholder=""
                  className="form-input"
                />
                <label>Name</label>
              </div>
              <ErrorMessage
                name="name"
                component="div"
                className="error-text"
              />

              <div className="form-group">
                <Field
                  type="email"
                  name="email"
                  placeholder=""
                  className="form-input"
                />
                <label>Email</label>
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="error-text"
              />

              <div className="form-group">
                <Field
                  type="password"
                  name="password"
                  placeholder=""
                  className="form-input"
                />
                <label>Password</label>
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <ErrorMessage
                name="password"
                component="div"
                className="error-text"
              />

              <div className="form-group">
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder=""
                  className="form-input"
                />
                <label>Confirm Password</label>
              </div>

              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error-text"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="auth-button"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="auth-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="link">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
