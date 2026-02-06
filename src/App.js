import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdatePassword from "./pages/UpdatePassword.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      
      {/* Password Update Route 
          Keep this public so the email link can reach it without redirection loops 
      */}
      <Route path="/update-password" element={<UpdatePassword />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;