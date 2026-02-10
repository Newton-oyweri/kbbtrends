import Navbar from '../components/Navbar.tsx';
import { useTheme } from './ThemeContext.tsx'; 

export default function Profile() {
  const { theme } = useTheme();

  // Helper to apply theme to Bootstrap-style cards
  const cardStyle = { 
    backgroundColor: theme.cardBg, 
    color: theme.text,
    border: 'none' 
  };

  return (
    <div 
      className="flex h-screen w-full overflow-hidden transition-all duration-700" 
      style={{ backgroundColor: theme.bg, fontFamily: theme.font, color: theme.text }}
    >
      <Navbar />

      <main className="flex-1 overflow-y-auto transition-all duration-700 relative">
        <div className="d-flex flex-column h-100">
          
          {/* Cover Photo */}
          <div className="position-relative w-100">
            <img
              src="./friends.jpeg"
              alt="Campus social group" // Fixed: Removed "Photo"
              className="w-100 object-cover"
              style={{ 
                height: 'clamp(180px, 35vw, 360px)',
                objectPosition: 'center'
              }}
            />

            {/* Profile Picture */}
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
                  alt="Olivia Wilson" // Fixed: Descriptive, not redundant
                  className="w-100 h-100 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="position-relative w-100 pt-5 pt-md-6 pb-5 px-4 px-md-5" style={{ backgroundColor: theme.bg }}>
            <div className="position-absolute top-0 end-0 d-flex gap-2 mt-3 me-3 me-md-5" style={{ zIndex: 3 }}>
              <button 
                className="btn rounded-pill px-4 py-2 fw-semibold shadow-sm"
                style={{ backgroundColor: theme.primary, color: 'white', border: 'none' }}
              >
                Follow
              </button>
              <button 
                className="btn rounded-pill px-4 py-2"
                style={{ border: `1px solid ${theme.primary}`, color: theme.primary }}
              >
                Message
              </button>
            </div>

            <div className="text-center">
              <h1 className="fw-bold mb-1" style={{ fontSize: 'clamp(1.9rem, 6vw, 3rem)' }}>
                Olivia Wilson
              </h1>
              <p className="opacity-75 mb-4 fs-5 fw-medium">
                Business Manager • Nairobi, Kenya
              </p>

              {/* Stats */}
              <div className="d-flex justify-content-center gap-5 flex-wrap mb-4">
                {[
                  { label: 'Followers', val: '3.2K' },
                  { label: 'Following', val: '1.4K' },
                  { label: 'Likes', val: '12K' },
                  { label: 'Posts', val: '248' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="fw-bold fs-3" style={{ color: theme.primary }}>{stat.val}</div>
                    <small className="opacity-60">{stat.label}</small>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="d-flex justify-content-center gap-3 mb-3">
                <button className="btn rounded-pill px-5 py-2 fw-semibold" style={{ backgroundColor: theme.primary, color: 'white', border: 'none' }}>
                  Posts
                </button>
                <button className="btn rounded-pill px-5 py-2" style={{ color: theme.text, border: `1px solid ${theme.text}44` }}>
                  Gallery
                </button>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="flex-grow-1 w-100" style={{ backgroundColor: theme.bg }}>
            <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
              <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                  
                  {/* Post Card */}
                  <div className="card shadow-sm mb-4 rounded-4 overflow-hidden border-0" style={cardStyle}>
                    <div className="card-body p-4 p-md-5">
                      <div className="d-flex align-items-center mb-4">
                        <img 
                          src="./profile.jpeg" 
                          alt="Olivia Wilson" 
                          className="rounded-circle me-3 shadow-sm" 
                          style={{ width: '56px', height: '56px', objectFit: 'cover' }} 
                        />
                        <div>
                          <h6 className="mb-0 fw-bold fs-5">Olivia Wilson</h6>
                          <small className="opacity-60">2 hours ago • 🌍 Public</small>
                        </div>
                      </div>
                      <p className="mb-4 fs-5 lh-base">
                        Just wrapped up an amazing project — productivity up 45% this quarter! 🚀 Grateful for the team and excited for what's next.
                      </p>
                      <img 
                        src="./kibabii.jpeg"
                        alt="Project milestone" 
                        className="img-fluid rounded-3 mb-4 shadow-sm w-100" 
                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                      />
                      <div className="d-flex justify-content-between align-items-center opacity-75 small fw-medium">
                        <span>1.2K Likes • 87 Comments</span>
                        <span>42 Shares</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}