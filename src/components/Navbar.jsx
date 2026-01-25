import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar fixed-top bg-black border-bottom border-primary p-2">
      <div className="container-fluid d-flex flex-nowrap overflow-auto" style={{ scrollbarWidth: 'none' }}>
        
        {/* Brand */}
        <Link className="navbar-brand text-primary fw-bold me-4" to="/dashboard">efootball</Link>

        {/* Scrollable Links */}
        <div className="d-flex flex-nowrap align-items-center">
          <NavLink to="/dashboard" icon="bi-house" label="Home" />
          <NavLink to="/teams" icon="bi-people" label="Teams" />
          <NavLink to="/admin" icon="bi-shield-lock" label="Admin" />
          <NavLink to="/account" icon="bi-person" label="Account" />
          
          <button 
            className="btn btn-sm btn-link text-primary text-decoration-none fw-bold ms-3" 
            onClick={() => supabase.auth.signOut().then(() => navigate("/"))}
            style={{ whiteSpace: 'nowrap' }}
          >
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>

      </div>
    </nav>
  );
}

function NavLink({ to, icon, label }) {
  return (
    <Link to={to} className="nav-link text-white px-3 d-flex align-items-center" style={{ whiteSpace: 'nowrap' }}>
      <i className={`bi ${icon} text-primary me-2`}></i> {label}
    </Link>
  );
}