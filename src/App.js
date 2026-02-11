import { Routes, Route } from "react-router-dom";
// Remove BrowserRouter from here if it's already in main.tsx/index.tsx
import Auth from "./pages/Auth";
import Home from "./pages/Home.tsx";
import Chat from "./pages/Chat.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Profileview from "./pages/Profileview.tsx";
import UpdatePassword from "./pages/UpdatePassword.js";
import { ThemeProvider } from './pages/ThemeContext.tsx';
import Profile from "./pages/Profile.tsx";
       import Chats from "./pages/Chats.tsx";

function App() {
  return (
    // Move ThemeProvider HERE so the theme stays consistent across all pages
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Auth />} />
        
        {/* Public Route */}
        <Route path="/update-password" element={<UpdatePassword />} />
 


<Route 
  path="/chats" 
  element={
    <ProtectedRoute>
      <Chats />
    </ProtectedRoute>
  } 
/>

        {/* Protected Routes - No extra Browsers needed here! */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
            <Route
          path="/profileview"
          element={
            <ProtectedRoute>
              <Profileview />
            </ProtectedRoute>
          }
        />
            <Route path="/profileview/:userId" element={<ProtectedRoute><Profileview /></ProtectedRoute>} />
       <Route path="/chat/:receiverId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

