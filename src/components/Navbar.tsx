import { useTheme } from '../pages/ThemeContext.tsx';
import { Link } from 'react-router-dom';
import { supabase } from "../supabase";

export default function Navbar() {
  const { theme, generateRandomTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { path: '/home', label: 'Vybz Stream', icon: 'bi-people-fill' },
    { path: '/profile', label: 'My Space', icon: 'bi-person-circle' },
    { path: '/chats', label: 'Messages', icon: 'bi-chat-dots-fill' },
  ];

  return (
    <header
      style={{
        backgroundColor: theme.cardBg,
        borderBottom: `2px solid ${theme.primary}40`,
        boxShadow: `0 4px 40px ${theme.glow}30`,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="sticky top-0 z-50 w-full px-6 h-20 flex items-center justify-between backdrop-blur-md"
    >
      {/* LOGO SECTION */}
      <div className="flex items-center gap-4">
        <span
          className="font-black text-2xl uppercase tracking-tighter"
          style={{ color: theme.text }}
        >
          Kbb trends
        </span>
      </div>

      {/* HORIZONTAL NAV LINKS */}
      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 group hover:scale-105"
            style={{ color: theme.text, textDecoration: 'none' }}
          >
            <i 
              className={`${link.icon} text-xl`} 
              style={{ color: theme.primary }}
            ></i>
            <span className="font-bold text-sm hidden lg:block">
              {link.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3">
        {/* CHAOS MODE */}
        <button
          onClick={generateRandomTheme}
          style={{
            backgroundColor: theme.primary,
            boxShadow: `0 0 15px ${theme.glow}`,
            color: '#fff'
          }}
          className="flex items-center justify-center p-3 rounded-xl transition-transform active:scale-95 group"
          title="Chaos Mode"
        >
          <i className="bi bi-magic"></i>
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={{ color: theme.text, border: `1px solid ${theme.primary}20` }}
          className="flex items-center justify-center p-3 rounded-xl hover:bg-red-500/10 transition-colors group"
          title="Logout"
        >
          <i className="bi bi-box-arrow-right" style={{ color: theme.primary }}></i>
        </button>
      </div>
    </header>
  );
}