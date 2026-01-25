import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard.tsx";
import Teams from "./pages/Team.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Account from "./pages/Account";  

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        }
      />  

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole={"admin" }>
            <Admin />
          </ProtectedRoute>
        }
      />    
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
       </Routes>
      );
}

export default App;
