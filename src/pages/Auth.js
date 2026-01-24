import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate("/dashboard");
  }

  async function signup() {
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    alert("Signup successful. Check your email.");
  }

  return (
    <div style={styles.viewport}>
      {/* MASSIVE BACKGROUND SHARDS */}
      <div style={styles.bgOrange}></div>
      <div style={styles.bgTeal}></div>
      <div style={styles.bgNavyGlass}></div>

      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", position: 'relative', zIndex: 10 }}>
        <div className="card shadow-lg border-0 text-white" style={styles.authCard}>
          <div className="card-body p-5 text-center">
            
            {/* Branding Section */}
            <div className="mb-5">
              <h1 className="display-4 fw-bold mb-0" style={{ letterSpacing: '2px', textTransform: 'capitalize' }}>efootball</h1>
              <div className="d-flex align-items-center justify-content-center mt-2" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                <span className="fw-bold me-2">
                  Skyla <sup style={{ fontSize: "0.6em", verticalAlign: 'top', top: '-0.5em' }}>®</sup>
                </span>
                <div style={{ width: '1px', height: '14px', background: 'white', opacity: 0.5 }}></div>
                <span className="ms-2 fw-light text-lowercase" style={{ letterSpacing: '1px' }}>smart ecosystem</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="mb-3">
              <input
                className="form-control form-control-lg bg-white bg-opacity-10 text-white border-secondary shadow-none"
                placeholder="Email"
                style={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="form-control form-control-lg bg-white bg-opacity-10 text-white border-secondary shadow-none"
                placeholder="Password"
                style={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="alert alert-danger py-2 small bg-danger bg-opacity-25 border-0 text-white">{error}</div>}

            {/* Buttons */}
            <div className="d-grid gap-2">
              <button 
                className="btn btn-lg fw-bold text-white border-0 shadow-sm" 
                style={{ backgroundColor: '#00b5ad', borderRadius: '0' }} 
                onClick={login} 
                disabled={loading}
              >
                {loading ? "Authenticating..." : "LOG IN"}
              </button>
              <button 
                className="btn btn-link text-white text-decoration-none small opacity-50 mt-2" 
                onClick={signup} 
                disabled={loading}
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </div>
          
          <div style={styles.bottomBorder}></div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  viewport: {
    backgroundColor: "#f8f9fa",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  // Spreading the shards across the full screen
  bgOrange: {
    position: "absolute",
    width: "120vw",
    height: "120vh",
    top: "-10%",
    left: "-10%",
    backgroundColor: "#f7931e",
    clipPath: "polygon(20% 0%, 100% 0%, 70% 100%, 0% 80%)",
    opacity: 0.8,
    zIndex: 1,
    transform: "rotate(-5deg)"
  },
  bgTeal: {
    position: "absolute",
    width: "110vw",
    height: "110vh",
    top: "-5%",
    right: "-5%",
    backgroundColor: "#00b5ad",
    clipPath: "polygon(10% 10%, 90% 0%, 100% 90%, 20% 100%)",
    mixBlendMode: "multiply", 
    opacity: 0.7,
    zIndex: 2,
    transform: "rotate(2deg)"
  },
  bgNavyGlass: {
    position: "absolute",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(10, 26, 68, 0.4)", // A wash of the navy color
    zIndex: 3,
  },
  authCard: {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "rgba(10, 26, 68, 0.95)", // Slightly transparent to let shards peak through
    borderRadius: "2px",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  inputField: {
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "0",
    fontSize: "0.95rem"
  },
  bottomBorder: {
    height: "6px",
    width: "100%",
    background: "linear-gradient(90deg, #f7931e 0%, #00b5ad 50%, #f7931e 100%)",
  }
};