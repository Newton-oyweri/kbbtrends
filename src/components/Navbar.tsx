import { useState } from 'react';
import { useTheme } from '../pages/ThemeContext.tsx';
import { FaBars, FaMagic, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { supabase } from "../supabase";

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, generateRandomTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
{ path: '/home', label: 'Vybz Stream', icon: <i className="bi bi-people-fill"></i> },

{ path: '/profile', label: 'My Space', icon: <i className="bi bi-person-circle"></i> },

{ path: '/chats', label: 'Messages', icon: <i className="bi bi-chat-dots-fill"></i> },

 
  ];

  return (
    <aside
      style={{
        backgroundColor: theme.cardBg,
        border: `2px solid ${theme.primary}40`,
        boxShadow: `0 0 40px ${theme.glow}30`,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        // Force the height and prevent any jumping
        height: 'calc(100vh - 20px)', 
        maxHeight: 'calc(100vh - 20px)',
      }}
      className={`m-[10px] flex flex-col rounded-[24px] overflow-hidden sticky top-[10px] shrink-0 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* HEADER / TOGGLE */}
      <div 
        className="h-20 flex items-center px-6 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaBars style={{ color: theme.primary }} className="text-xl flex-shrink-0" />
        <span
          className={`ml-4 font-black text-xl uppercase tracking-tighter transition-all duration-500 whitespace-nowrap ${
            isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
          style={{ color: theme.text }}
        >
          Kbb trends
        </span>
      </div>

      {/* NAV LINKS - overflow-y-auto ensures if you add 20 links, they scroll INSIDE the nav, not push it down */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${
              isExpanded ? 'justify-start' : 'justify-center'
            }`}
            style={{ color: theme.text, textDecoration: 'none' }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110 flex-shrink-0"
              style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
            >
              {link.icon}
            </div>
            {isExpanded && (
              <span className="font-bold text-sm transition-opacity duration-300">
                {link.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-3 space-y-2 border-t flex-shrink-0" style={{ borderColor: `${theme.primary}20` }}>
        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={{ color: theme.text, border: `1px solid ${theme.primary}20` }}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl hover:bg-red-500/10 transition-colors"
        >
          <FaSignOutAlt style={{ color: theme.primary }} className="flex-shrink-0" />
          {isExpanded && <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>}
        </button>

        {/* CHAOS MODE */}
        <button
          onClick={generateRandomTheme}
          style={{
            backgroundColor: theme.primary,
            boxShadow: `0 0 15px ${theme.glow}`,
            color: '#fff'
          }}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl transition-transform active:scale-95 font-bold"
        >
          <FaMagic className="flex-shrink-0" />
          {isExpanded && <span className="text-[10px] font-black uppercase tracking-widest">Chaos Mode</span>}
        </button>
      </div>
    </aside>
  );
}