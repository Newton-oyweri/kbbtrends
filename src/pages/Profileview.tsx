import Navbar from '../components/Navbar.tsx';
import { useTheme } from './ThemeContext.tsx'; 

export default function Profile() {
  const { theme } = useTheme();

  return (
    <div 
      className="flex h-screen w-full overflow-hidden transition-all duration-700" 
      style={{ backgroundColor: theme.bg, fontFamily: theme.font, color: theme.text }}
    >
      <Navbar />

      {/* Main content - THE ALL-ROUND GLOW IS HERE */}
 <main 
  className="flex-1 overflow-y-auto transition-all duration-700 relative"
  style={{ 
    border: `3px solid ${theme.primary}`,
    boxShadow: `inset 0 0 40px ${theme.glow}, 0 0 20px ${theme.glow}`,
    margin: '8px',
    borderRadius: '24px',
    overflow: 'hidden'
  }}
>
  <div className="d-flex flex-column h-100">
    {/* Large Cover Photo – full width */}
    <div className="position-relative w-100">
      <img
        src="./friends.jpeg"
        alt="Cover Photo"
        className="w-100 object-cover"
        style={{ 
          height: 'clamp(180px, 35vw, 360px)',
          objectPosition: 'center'
        }}
      />

      {/* Circular Profile Picture overlapping cover */}
      <div 
        className="position-absolute bottom-0 start-50 translate-middle-x mb-n5 mb-md-n6"
        style={{ zIndex: 2 }}
      >
        <div 
          className="rounded-circle overflow-hidden border border-5 shadow-lg"
          style={{ 
            width: 'clamp(120px, 25vw, 180px)',
            height: 'clamp(120px, 25vw, 180px)',
            borderColor: theme.primary,
            backgroundColor: theme.bg
          }}
        >
          <img
            src="./profile.jpeg"
            alt="Profile"
            className="w-100 h-100 object-cover"
          />
        </div>
      </div>
    </div>

    {/* Profile Info + Stats + Buttons */}
    <div className="position-relative w-100 pt-5 pt-md-6 pb-5 px-4 px-md-5" style={{ backgroundColor: theme.bg }}>
      {/* Follow / Actions – moved to top-right */}
      <div 
        className="position-absolute top-0 end-0 d-flex gap-2 mt-3 me-3 me-md-5"
        style={{ zIndex: 3 }}
      >
        <button 
          className="btn rounded-pill px-4 py-2 fw-semibold shadow-sm"
          style={{ 
            backgroundColor: theme.primary, 
            color: 'white',
            border: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Follow
        </button>
        <button 
          className="btn btn-outline-secondary rounded-pill px-4 py-2"
        >
          Message
        </button>
      </div>

      <div className="text-center">
        <h1 
          className="fw-bold mb-1"
          style={{ 
            color: theme.text,
            fontSize: 'clamp(1.9rem, 6vw, 3rem)'
          }}
        >
          Olivia Wilson
        </h1>
        <p className="text-muted mb-4 fs-5 fw-medium">
          Business Manager • Nairobi, Kenya
        </p>

        {/* Stats – full width friendly */}
        <div className="d-flex justify-content-center gap-5 gap-md-5 flex-wrap mb-4">
          <div className="text-center">
            <div className="fw-bold fs-3" style={{ color: theme.primary }}>3.2K</div>
            <small className="text-muted">Followers</small>
          </div>
          <div className="text-center">
            <div className="fw-bold fs-3" style={{ color: theme.primary }}>1.4K</div>
            <small className="text-muted">Following</small>
          </div>
          <div className="text-center">
            <div className="fw-bold fs-3" style={{ color: theme.primary }}>12K</div>
            <small className="text-muted">Likes</small>
          </div>
          <div className="text-center">
            <div className="fw-bold fs-3" style={{ color: theme.primary }}>248</div>
            <small className="text-muted">Posts</small>
          </div>
        </div>

        {/* Tab-like buttons (Posts / Gallery) */}
        <div className="d-flex justify-content-center gap-3 mb-3">
          <button 
            className="btn rounded-pill px-5 py-2 fw-semibold active"
            style={{ 
              backgroundColor: theme.primary, 
              color: 'white',
              border: 'none'
            }}
          >
            Posts
          </button>
          <button 
            className="btn btn-outline-secondary rounded-pill px-5 py-2"
          >
            Gallery
          </button>
        </div>
      </div>
    </div>

    {/* Posts Feed – full 100% width, nicely styled cards */}
    <div className="flex-grow-1 w-100" style={{ backgroundColor: theme.bg }}>
      <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            {/* Post 1 – full width card */}
            <div className="card border-0 shadow-md mb-4 rounded-4 overflow-hidden hover-shadow-lg transition-all">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-center mb-4">
                  <img 
                    src="./profile.jpeg" 
                    alt="User" 
                    className="rounded-circle me-3 shadow-sm" 
                    style={{ width: '56px', height: '56px', objectFit: 'cover' }} 
                  />
                  <div>
                    <h6 className="mb-0 fw-bold fs-5">Olivia Wilson</h6>
                    <small className="text-muted">2 hours ago • 🌍 Public</small>
                  </div>
                </div>
                <p className="mb-4 fs-5 lh-base">
                  Just wrapped up an amazing project — productivity up 45% this quarter! 🚀 Grateful for the team and excited for what's next.
                </p>
                <img 
                  src="./kibabii.jpeg"
                  alt="Post" 
                  className="img-fluid rounded-3 mb-4 shadow-sm" 
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                />
                <div className="d-flex justify-content-between align-items-center text-muted small fw-medium">
                  <span>1.2K Likes • 87 Comments</span>
                  <span>42 Shares</span>
                </div>
              </div>
            </div>

            {/* Post 2 – full width, text-only */}
            <div className="card border-0 shadow-md mb-4 rounded-4 overflow-hidden hover-shadow-lg transition-all">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-center mb-4">
                  <img 
                    src="./profile.jpeg" 
                    alt="User" 
                    className="rounded-circle me-3 shadow-sm" 
                    style={{ width: '56px', height: '56px', objectFit: 'cover' }} 
                  />
                  <div>
                    <h6 className="mb-0 fw-bold fs-5">Olivia Wilson</h6>
                    <small className="text-muted">Yesterday • 👥 Friends</small>
                  </div>
                </div>
                <p className="mb-0 fs-5 lh-base">
                  Quick tip: Redesigning your onboarding flow can boost user retention by 20-30%. Who's trying this next week? 💡 Drop your thoughts below!
                </p>
              </div>
            </div>

            {/* You can add more posts here – they will all be full-width */}
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
    </div>
  );
}