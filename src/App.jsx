import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import Navbar from "./components/Shared/Navbar";
import { useSelector } from "react-redux";


function App() {
  const { token } = useSelector((state) => state.auth);

  const isAuthenticated= useSelector(state => state.auth.isAuthenticated);

  console.log(token);

  return (
    <>
    
      <Router>
      <Navbar />
        <Routes>

          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
