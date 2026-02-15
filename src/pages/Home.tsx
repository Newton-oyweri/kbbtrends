import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext.tsx';
import PostFeed from '../components/PostFeed.tsx';
import UserDiscovery from '../components/UserDiscovery.tsx';
import { Zap, Search, Bell } from 'lucide-react';
import { supabase } from '../supabase';

export default function Dashboard() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('trends');
  const [currentUser, setCurrentUser] = useState<{ avatar_url: string | null; display_name: string | null } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', user.id)
          .single();
        setCurrentUser(data);
      }
    };
    fetchUser();
  }, []);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: theme.bg, color: theme.text, overflowX: 'hidden' }}>
      
      {/* --- KIBABII TRENDS NAVBAR --- */}
      <nav className="navbar fixed-top px-md-5 px-3" style={{ 
        backgroundColor: `${theme.bg}F2`, 
        backdropFilter: 'blur(15px)', 
        borderBottom: `1px solid ${theme.border || '#1e3a5f'}88`, 
        height: '75px', 
        zIndex: 1050 
      }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <Zap size={28} color={theme.primary} fill={theme.primary} className="me-2" />
            <h1 className="m-0 d-none d-md-block" style={{ fontSize: '1.8rem', letterSpacing: '-1px' }}>
              <span style={{ color: theme.text, fontWeight: '800' }}>KIBABII</span>
              <span className="animate-trends ms-2">TRENDS</span>
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="d-flex align-items-center bg-dark rounded-pill px-3 py-2 mx-3" style={{ flex: 1, maxWidth: '400px', border: `1px solid ${theme.border || '#1e3a5f'}` }}>
            <Search size={18} className="opacity-50 me-2" style={{ color: theme.text }} />
            <input 
              type="text" 
              placeholder="Search Campus..." 
              className="bg-transparent border-0 w-100" 
              style={{ outline: 'none', color: theme.text, fontSize: '0.9rem' }} 
            />
          </div>

          <div className="d-flex gap-3 gap-md-4 align-items-center">
            <Bell size={22} style={{ cursor: 'pointer', color: theme.text }} />
            <Link to="/profile">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt="Me"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${theme.primary}80` }}
                />
              ) : (
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', background: theme.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold'
                }}>
                  {(currentUser?.display_name?.[0] || '?').toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="container-fluid" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
        <div style={{  margin: '0 auto' }}>
          
          {/* TAB NAVIGATION */}
          <div className="d-flex justify-content-center mb-5 gap-3">
            <button 
              onClick={() => setActiveTab('trends')} 
              className="btn rounded-pill px-4 fw-bold shadow-sm" 
              style={{ 
                backgroundColor: activeTab === 'trends' ? theme.primary : 'transparent', 
                color: activeTab === 'trends' ? '#000' : theme.text,
                border: `1px solid ${activeTab === 'trends' ? theme.primary : theme.primary + '44'}`
              }}
            >
              Trends
            </button>
            <button 
              onClick={() => setActiveTab('comrades')} 
              className="btn rounded-pill px-4 fw-bold shadow-sm" 
              style={{ 
                backgroundColor: activeTab === 'comrades' ? theme.primary : 'transparent', 
                color: activeTab === 'comrades' ? '#000' : theme.text,
                border: `1px solid ${activeTab === 'comrades' ? theme.primary : theme.primary + '44'}`
              }}
            >
              Comrades
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="tab-fade-in">
            {activeTab === 'trends' ? <PostFeed /> : <UserDiscovery />}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-trends {
          background: linear-gradient(-45deg, ${theme.primary}, #ff9500, #4bbdff, ${theme.primary});
          background-size: 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 6s ease infinite;
          font-weight: 900;
        }
        .tab-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}