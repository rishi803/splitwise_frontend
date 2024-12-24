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
import { useSelector } from "react-redux";
import Navbar from "./components/Shared/Navbar";

function App() {
  const { token } = useSelector((state) => state.auth);

  console.log(token);

  return (
    <>
      <Navbar />
      <Router>
        <Routes>

          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" /> : <Login />}
          />

          <Route
            path="/signup"
            element={token ? <Navigate to="/dashboard" /> : <Signup />}
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
