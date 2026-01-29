import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Check if we actually have a session (Supabase does this via the URL fragment automatically)
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== "PASSWORD_RECOVERY") {
        // If they try to access this page without a recovery token, kick them back to login
        // navigate("/auth");
      }
    });
  }, [navigate]);

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Wait 2 seconds so they see the success message, then redirect
      setTimeout(() => navigate("/dashboard"), 2000);
    }
  }

  return (
    <div style={styles.viewport}>
      <div style={styles.bgOrange}></div>
      <div style={styles.bgTeal}></div>
      <div style={styles.bgNavy}></div>

      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="card shadow-lg border-0 text-white" style={styles.authCard}>
          <div className="card-body p-5 text-center">
            
            <div className="mb-5">
              <h1 className="display-5 fw-bold mb-0">efootball</h1>
              <p className="small opacity-50">Set New Password</p>
            </div>

            {success ? (
              <div className="animate__animated animate__fadeIn">
                <div className="mb-4" style={{ fontSize: "3rem" }}>✅</div>
                <h4>Password Updated!</h4>
                <p className="small opacity-75">Redirecting you to dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword}>
                <div className="mb-4">
                  <input
                    type="password"
                    required
                    className="form-control form-control-lg bg-white bg-opacity-10 text-white border-secondary shadow-none"
                    placeholder="Enter new password"
                    style={styles.inputField}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <div className="alert alert-danger py-2 small bg-danger bg-opacity-25 border-0 text-white mb-4">{error}</div>}

                <div className="d-grid">
                  <button 
                    type="submit"
                    className="btn btn-lg fw-bold text-white border-0 shadow-sm" 
                    style={{ backgroundColor: '#f7931e', transition: '0.3s' }} 
                    disabled={loading}
                  >
                    {loading ? <span className="spinner-border spinner-border-sm"></span> : "UPDATE PASSWORD"}
                  </button>
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

// Re-using your exact styles for visual consistency
const styles = {
  viewport: { backgroundColor: "#eef2f3", height: "100vh", width: "100vw", overflow: "hidden", position: "relative" },
  bgOrange: { position: "absolute", width: "80%", height: "80%", top: "-10%", left: "-10%", backgroundColor: "#f7931e", clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)", opacity: 0.6, zIndex: 1 },
  bgTeal: { position: "absolute", width: "70%", height: "90%", bottom: "-10%", right: "-10%", backgroundColor: "#00b5ad", clipPath: "polygon(0% 15%, 85% 0%, 100% 85%, 15% 100%)", mixBlendMode: "multiply", opacity: 0.7, zIndex: 2 },
  bgNavy: { position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(10, 26, 68, 0.2)", zIndex: 3 },
  authCard: { zIndex: 10, width: "100%", maxWidth: "420px", backgroundColor: "#0a1a44", borderRadius: "0", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" },
  inputField: { border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0", fontSize: "0.9rem", color: "white" },
  bottomBorder: { height: "6px", width: "100%", background: "linear-gradient(90deg, #f7931e 0%, #00b5ad 50%, #f7931e 100%)" }
};