import React from 'react';
import Navbar from '../components/Navbar';
import { FaCheckCircle } from 'react-icons/fa';

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full border-t border-blue-500 overflow-hidden bg-gray-50">
      <Navbar />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto"> 

          {/* MASONRY-STYLE GRID 
            - column-1 on mobile
            - lg:column-2 on large screens
          */}
          <div className="w-100" style={{ 
            columnCount: 'auto', 
            columnWidth: '350px', // This triggers the "two-way" look when screen is wide
            columnGap: '1.5rem' 
          }}>
            
            {Array.from({ length: 10 }).map((_, i) => (
              /* Inline-block and break-inside prevent cards from splitting in half */
              <div key={i} className="mb-4 d-inline-block w-100" style={{ breakInside: 'avoid' }}>
                
                <div className="card border-0 shadow-sm rounded-3">
                  {/* Header */}
                  <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
                    <div className="d-flex align-items-center">
                      <img src="./profile.jpeg" alt="Profile" className="rounded-circle me-2" width="40" height="40" />
                      <div>
                        <h6 className="mb-0 fw-bold d-flex align-items-center">
                          Moh crushiee
                          <FaCheckCircle className="text-primary ms-1" style={{ fontSize: '0.85rem' }} />
                        </h6>
                        <small className="text-muted">{i + 1}h ago · <i className="bi bi-globe"></i></small>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Content: Mixing long/short text and images */}
                  <div className="card-body py-2">
                    <p className="card-text text-gray-700">
                      {i % 2 === 0 
                        ? "Just a short update today! 🚀" 
                        : "Testing out a much longer post content to see how the Masonry grid handles different heights. This post should be taller than the others and push the next one down naturally without leaving a weird white gap! #Design #Code"}
                    </p>
                  </div>

                  {/* Only show image on every other post to create height variety */}
                  {i % 2 === 0 && (
                    <img src="./friends.jpeg" className="img-fluid" alt="Post content" />
                  )}

                  {/* Engagement */}
                  <div className="px-3 py-2 d-flex justify-content-between border-bottom mx-2">
                    <div className="d-flex align-items-center">
                      <span className="badge rounded-pill bg-primary me-1"><i className="bi bi-hand-thumbs-up-fill"></i></span>
                      <small className="text-muted">1.{i}k</small>
                    </div>
                    <div className="text-muted">
                      <small className="me-2">{i * 5} Comments</small>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-footer bg-white border-0 d-flex justify-content-around py-1">
                    <button className="btn btn-light text-muted flex-fill mx-1 py-2">
                      <i className="bi bi-hand-thumbs-up me-2"></i>Like
                    </button>
                    <button className="btn btn-light text-muted flex-fill mx-1 py-2">
                      <i className="bi bi-chat-left me-2"></i>Comment
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}