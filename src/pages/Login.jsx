import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { loginSchema } from '../utils/validation';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import api from '../utils/api';
import '../styles/FormStyles.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState('');

  const { isAuthenticated } = useSelector((state) => state.auth);

  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(loginStart());
    try {
      const response = await api.post('/auth/login', values);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      dispatch(loginSuccess(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      setServerError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInput= ()=>{
      setServerError('');
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
      <div className="auth-card-background"></div>
      <div className="auth-card-content">
        <h2>Login</h2>
        {serverError && <div className="error-message">{serverError}</div>}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <Field
                  type="email"
                  name="email"
                  onInput={handleInput}
                  placeholder=""
                  className="form-input"
                />
                <label className='special-label'>Email</label>
              
              </div>
              <ErrorMessage name="email" component="div" className="error-text" />

              <div className="form-group password-group">
                <Field
                  type={passwordVisible ? 'text' : 'password'}
                  name="password"
                  onInput={handleInput}
                  placeholder=""
                  className="form-input"
                />
                <label className='special-label'>Password</label>
                <span
                  className="eye-icon"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
            
              </div>

              <ErrorMessage name="password" component="div" className="error-text" />

              <button
                type="submit"
                disabled={isSubmitting}
                className="auth-button"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="auth-link">
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} className="link">
            Sign up
          </span>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Login;
