import React from 'react';
import Navbar from '../components/Navbar';
import { FaCheckCircle } from 'react-icons/fa';



export default function Dashboard() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <Navbar />

      {/* Main content - always scrollable, no ml needed anymore (sidebar handles width) */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 lg:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

          <p className="text-lg text-gray-700 mb-8">
            Welcome! Scroll down to see how content moves independently.
          </p>

          {/* Long content example */}
          {Array.from({ length: 30 }).map((_, i) => (
            <p key={i} className="mb-4 text-gray-600">
           <div className="container mt-5 w-100">
  <div className="row ">
    <div className="col-12">
      
      <div className="card border-0 shadow-sm rounded-3">
        
        <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center">
            <img src="./profile.jpeg" alt="Profile" className="rounded-circle me-2" width="40" height="40" />
            <div>
        
<h6 className="mb-0 fw-bold d-flex align-items-center">
  Moh crushiee
  <FaCheckCircle className="text-primary ms-1" style={{ fontSize: '0.85rem' }} title="Verified" />
</h6>
              <small className="text-muted">12 hours ago · <i className="fas fa-globe-americas"></i></small>
            </div>
          </div>
          <button className="btn btn-light btn-sm rounded-circle">
            <i className="bi bi-three-dots"></i>
          </button>
        </div>

        <div className="card-body py-2">
          <p className="card-text">
            Just launched the new navbar design! Check out how the transition works between the expanded and collapsed states. #UIUX #Bootstrap #WebDev
          </p>
        </div>

        <img src="./kibabii.jpeg" className="img-fluid" alt="Post content" />

        <div className="px-3 py-2 d-flex justify-content-between border-bottom mx-2">
          <div className="d-flex align-items-center">
            <span className="badge rounded-pill bg-primary me-1"><i className="bi bi-hand-thumbs-up-fill"></i></span>
            <small className="text-muted">1.2k</small>
          </div>
          <div className="text-muted">
            <small className="me-2">45 Comments</small>
            <small>12 Shares</small>
          </div>
        </div>

        <div className="card-footer bg-white border-0 d-flex justify-content-around py-1">
          <button className="btn btn-ghost text-muted w-100 py-2 hover-bg-light">
            <i className="bi bi-hand-thumbs-up me-2"></i>Like
          </button>
          <button className="btn btn-ghost text-muted w-100 py-2 hover-bg-light">
            <i className="bi bi-chat-left me-2"></i>Comment
          </button>
          <button className="btn btn-ghost text-muted w-100 py-2 hover-bg-light">
            <i className="bi bi-share me-2"></i>Share
          </button>
        </div>

      </div> </div>
  </div>
</div>  </p>
          ))}
        </div>
      </main>
    </div>
  );
}