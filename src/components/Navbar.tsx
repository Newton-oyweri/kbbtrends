import { useState } from 'react';
import { useTheme } from '../pages/ThemeContext.tsx';
import { FaBars, FaMagic } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import this at the top

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, generateRandomTheme } = useTheme();

  // 1. DEFINE YOUR PATHS HERE
  const navLinks = [
    { path: '/home', label: 'Vybz stream', icon: <i className="bi bi-broadcast"></i> },
    { path: '/profile',  label: 'My space',    icon: <i className="bi bi-person-workspace"></i> },
 ];

  return (
    <aside
      style={{ 
        backgroundColor: theme.cardBg, 
        border: `3px solid ${theme.primary}`,
        boxShadow: `inset 0 0 30px ${theme.glow}, 0 0 20px ${theme.glow}`,
        margin: '8px',
        marginRight: '4px',
        borderRadius: '24px' 
      }}
      className={`h-[calc(100vh-16px)] flex flex-col transition-all duration-700 z-20 ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      <div className="h-20 flex items-center px-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <FaBars style={{ color: theme.primary }} className="text-xl flex-shrink-0" />
        {isExpanded && (
          <span 
            className="ml-4 font-black text-xl uppercase tracking-tighter transition-all duration-500"
            style={{ color: theme.text }}
          >
            Kbb trends
          </span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-2 overflow-y-auto no-scrollbar">
        {/* 2. MAP THROUGH YOUR LINKS */}
        {navLinks.map((link, index) => (
          <NavItem 
            key={index}
            path={link.path}
            icon={link.icon} 
            label={link.label} 
            expanded={isExpanded} 
            theme={theme} 
          />
        ))}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: `${theme.primary}20` }}>
        <button
          onClick={(e) => { e.stopPropagation(); generateRandomTheme(); }}
          style={{ 
            backgroundColor: theme.primary, 
            boxShadow: `0 0 20px ${theme.glow}`,
            color: '#fff' 
          }}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl transition-transform active:scale-95 font-bold"
        >
          <FaMagic />
          {isExpanded && <span className="text-xs uppercase tracking-widest">Chaos Mode</span>}
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, expanded, theme, path }: any) {
  return (
    <Link 
      to={path}  // Use 'to' instead of 'href'
      className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${expanded ? 'justify-start' : 'justify-center'}`}
      style={{ 
        color: theme.text,
        textDecoration: 'none' // Bootstrap sometimes adds underlines to links
      }}
    >
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all"
        style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
      >
        {icon}
      </div>
      {expanded && (
        <span 
          className="font-bold text-sm whitespace-nowrap opacity-80 group-hover:opacity-100 transition-all duration-500"
          style={{ color: theme.text }}
        >
          {label}
        </span>
      )}
    </Link>
  );
}
