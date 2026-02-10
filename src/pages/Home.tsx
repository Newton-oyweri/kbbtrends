import React from 'react';
import Navbar from '../components/Navbar.tsx';
import { FaCheckCircle } from 'react-icons/fa';
import { useTheme } from './ThemeContext.tsx'; 
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();  

  return (
    <div 
      className="flex h-screen w-full overflow-hidden transition-all duration-700" 
      style={{ backgroundColor: theme.bg, fontFamily: theme.font, color: theme.text }}
    >
      <Navbar />

      <main
        className="flex-1 overflow-y-auto transition-all duration-700 relative"
      >
        <div >
          {/* Feed */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="mb-4">
              <div className="container mt-5 w-100 text-start">
                <div className="row">
                  <div className="col-12">
                    <div
                      className="card border-0 shadow-sm rounded-3 overflow-hidden transition-all duration-500 cursor-pointer hover-shadow"
                      style={{
                        backgroundColor: theme.cardBg,
                        border: `1px solid ${theme.primary}20`
                      }}
                      onClick={() => navigate('/profileview')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate('/profileview');
                        }
                      }}
                    >
                      <div
                        className="card-header border-0 d-flex align-items-center justify-content-between py-3"
                        style={{ backgroundColor: theme.cardBg }}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src="./profile.jpeg"
                            alt="Moh crushiee profile"
                            className="rounded-circle me-2 border"
                            style={{ borderColor: theme.primary }}
                            width="40"
                            height="40"
                          />
                          <div>
                            <h6 className="mb-0 fw-bold d-flex align-items-center" style={{ color: theme.text }}>
                              Moh crushiee
                              <FaCheckCircle className="ms-1" style={{ fontSize: '0.85rem', color: theme.primary }} title="Verified" />
                            </h6>
                            <small style={{ color: theme.text, opacity: 0.6 }}>
                              12 hours ago · <i className="fas fa-globe-americas"></i>
                            </small>
                          </div>
                        </div>
                        <button
                          className="btn btn-light btn-sm rounded-circle"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="bi bi-three-dots"></i>
                        </button>
                      </div>

                      <div className="card-body py-2">
                        <p className="card-text" style={{ color: theme.text }}>
                          Just launched the new navbar design! Check out how the transition works between the expanded and collapsed states. #UIUX #Bootstrap #WebDev
                        </p>
                      </div>

                      <img src="./kibabii.jpeg" className="img-fluid" alt="Post content" />

                      <div className="px-3 py-2 d-flex justify-content-between border-bottom mx-2" style={{ borderColor: `${theme.primary}20` }}>
                        <div className="d-flex align-items-center">
                          <span
                            className="badge rounded-pill me-1 d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: theme.primary, color: '#fff', padding: '5px' }}
                          >
                            <i className="bi bi-hand-thumbs-up-fill"></i>
                          </span>
                          <small style={{ color: theme.text, opacity: 0.7 }}>1.2k</small>
                        </div>
                        <div style={{ color: theme.text, opacity: 0.7 }}>
                          <small className="me-2">45 Comments</small>
                          <small>12 Shares</small>
                        </div>
                      </div>

                      <div className="card-footer border-0 d-flex justify-content-around py-1" style={{ backgroundColor: theme.cardBg }}>
                        <button
                          className="btn btn-ghost w-100 py-2 transition-all"
                          style={{ color: theme.text, fontWeight: 'bold' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.primary}15`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="bi bi-hand-thumbs-up me-2" style={{ color: theme.primary }}></i>Like
                        </button>
                        <button
                          className="btn btn-ghost w-100 py-2 transition-all"
                          style={{ color: theme.text, fontWeight: 'bold' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.primary}15`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="bi bi-chat-left me-2" style={{ color: theme.primary }}></i>Comment
                        </button>
                        <button
                          className="btn btn-ghost w-100 py-2 transition-all"
                          style={{ color: theme.text, fontWeight: 'bold' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.primary}15`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="bi bi-share me-2" style={{ color: theme.primary }}></i>Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}