import { useState } from "react"; // Removed useEffect from here
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);

  const switchMode = (mode) => {
    setAuthMode(mode);
    setError(null);
    setMessage(null);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        navigate("/home");
      }
    } else if (authMode === "signup") {
      const { error, data } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        // Specific check for existing emails
        if (error.message.includes("User already registered")) {
          setError("Account already exists. Try logging in!");
        } else {
          setError(error.message);
        }
      } else if (data.user && data.session === null) {
        setIsSignedUp(true);
      } else {
        navigate("/home");
      }
    } else if (authMode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setMessage("Password reset link sent to your email!");
      }
    }
  }

  return (
    <div style={styles.viewport}>
      {/* Background graphics... */}
      <div style={styles.bgOrange}></div>
      <div style={styles.bgTeal}></div>
      <div style={styles.bgNavy}></div>

      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="card shadow-lg border-0 text-white" style={styles.authCard}>
          <div className="card-body p-5 text-center">
            
            <div className="mb-5">
              <h1 className="display-5 fw-bold mb-0">KBB trends</h1>
              <div className="d-flex align-items-center justify-content-center mt-1" style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                <span className="fw-bold me-2">Skyla <sup style={{ fontSize: "1em" }}>®</sup></span>
                <div style={{ width: '1px', height: '14px', background: 'white', opacity: 0.5 }}></div>
                <span className="ms-2 fw-light text-lowercase">smart ecosystem</span>
              </div>
            </div>

            {isSignedUp ? (
              <div className="animate__animated animate__fadeIn">
                <div className="mb-4" style={{ fontSize: "3rem" }}>✉️</div>
                <h4>Check your inbox</h4>
                <p className="small opacity-75">We sent a verification link to {email}</p>
                <button className="btn btn-sm btn-outline-light mt-3" onClick={() => setIsSignedUp(false)}>Back to Login</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="h5 mb-4 opacity-75">
                  {authMode === "login" ? "Welcome Back" : authMode === "signup" ? "Create Account" : "Reset Password"}
                </h3>
                
                <div className="mb-3">
                  <input
                    type="email"
                    required
                    className="form-control form-control-lg bg-white bg-opacity-10 text-white border-secondary shadow-none"
                    placeholder="Email Address"
                    style={styles.inputField}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                {authMode !== "reset" && (
                  <div className="mb-4">
                    <input
                      type="password"
                      required
                      className="form-control form-control-lg bg-white bg-opacity-10 text-white border-secondary shadow-none"
                      placeholder="Password"
                      style={styles.inputField}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}

                {error && <div className="alert alert-danger py-2 small bg-danger bg-opacity-25 border-0 text-white mb-4">{error}</div>}
                {message && <div className="alert alert-success py-2 small bg-success bg-opacity-25 border-0 text-white mb-4">{message}</div>}

                <div className="d-grid gap-3">
                  <button 
                    type="submit"
                    className="btn btn-lg fw-bold text-white border-0 shadow-sm" 
                    style={{ backgroundColor: '#00b5ad', transition: '0.3s' }} 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      authMode === "login" ? "LOG IN" : authMode === "signup" ? "SIGN UP" : "SEND RESET LINK"
                    )}
                  </button>
                  
                  <div className="d-flex flex-column gap-2 mt-2">
                    {authMode === "login" && (
                      <button type="button" style={styles.linkBtn} onClick={() => switchMode("reset")}>
                        Forgot Password?
                      </button>
                    )}
                    <button 
                      type="button"
                      style={styles.linkBtn}
                      onClick={() => switchMode(authMode === "login" ? "signup" : "login")}
                    >
                      {authMode === "login" ? "New here? Create account" : "Already have an account? Log in"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div style={styles.bottomBorder}></div>
        </div>
      </div>
    </div>
  );
}

// styles remain the same...

const styles = {
  viewport: {
    backgroundColor: "#eef2f3",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "relative",
  },
  bgOrange: {
    position: "absolute",
    width: "80%",
    height: "80%",
    top: "-10%",
    left: "-10%",
    backgroundColor: "#f7931e",
    clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
    opacity: 0.6,
    zIndex: 1,
  },
  bgTeal: {
    position: "absolute",
    width: "70%",
    height: "90%",
    bottom: "-10%",
    right: "-10%",
    backgroundColor: "#00b5ad",
    clipPath: "polygon(0% 15%, 85% 0%, 100% 85%, 15% 100%)",
    mixBlendMode: "multiply",
    opacity: 0.7,
    zIndex: 2,
  },
  bgNavy: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(10, 26, 68, 0.2)",
    zIndex: 3,
  },
  authCard: {
    zIndex: 10,
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#0a1a44",
    borderRadius: "0",
    overflow: "hidden",
    boxShadow: "0 30px 60px rgba(0,0,0,0.5)"
  },
  inputField: {
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "0",
    fontSize: "0.9rem",
    color: "white"
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "0.85rem",
    opacity: 0.75,
    cursor: "pointer",
    textDecoration: "none"
  },
  bottomBorder: {
    height: "6px",
    width: "100%",
    background: "linear-gradient(90deg, #f7931e 0%, #00b5ad 50%, #f7931e 100%)",
  }
};