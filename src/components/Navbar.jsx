// components/Navbar.tsx  (or Sidebar.tsx)
import { useState } from 'react';
import {
  FaHome,
  FaSquare,
  FaThLarge,
  FaBars,
  FaSearch,
  FaBullhorn,
  FaExpandArrowsAlt,
} from 'react-icons/fa';

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <aside
      data-expanded={isExpanded}
      className={`h-100 bg-white border-r border-blue-500 shadow-lg flex flex-col transition-all duration-300 z-20
        ${isExpanded ? 'w-fit' : 'w-fit'}`}
    >
      {/* Top Toggle / Logo Area – smaller height */}
      <div
        className=" border-t border-blue-500 h-16 flex items-center justify-center border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleSidebar}
      >
        {isExpanded ? (
          <div className="flex border-t border-blue-500 items-center gap-3 mt-2 px-4 w-full">
            <FaBars className="text-xl text-gray-700 flex-shrink-0" />
            <span className="font-bold text-lg text-gray-900 truncate">
              Kbb trends
            </span>
          </div>
        ) : (
          <FaBars className="text-xl text-gray-700" />
        )}
      </div>

      {/* Navigation Items – tighter spacing, smaller icons, no scroll */}
      <nav className="flex-1 py-5 flex flex-col border-t border-blue-500 items-center">
        <ul className="space-y-4 border-t border-blue-500 w-full px-1">
          <li>
            <a
              href="#"
              className={`flex items-center ${
                isExpanded ? 'justify-start px-3' : 'justify-center'
              } gap-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition w-full`}
            >
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0">
                <FaHome className="text-lg" />
              </div>
              {isExpanded && <span className="font-medium text-sm">All Types</span>}
            </a>
          </li>

          <li>
            <a
              href="#"
              className={`flex items-center ${
                isExpanded ? 'justify-start px-3' : 'justify-center'
              } gap-3 py-2.5 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition w-full`}
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FaSquare className="text-lg" />
              </div>
              {isExpanded && <span className="font-medium text-sm">Static</span>}
            </a>
          </li>

          <li>
            <a
              href="#"
              className={`flex items-center ${
                isExpanded ? 'justify-start px-3' : 'justify-center'
              } gap-3 py-2.5 rounded-lg bg-pink-50 text-pink-700 font-medium w-full`}
            >
              <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0">
                <FaThLarge className="text-lg" />
              </div>
              {isExpanded && <span className="font-medium text-sm">Mega Menu</span>}
            </a>
          </li>

          <li>
            <a
              href="#"
              className={`flex items-center ${
                isExpanded ? 'justify-start px-3' : 'justify-center'
              } gap-3 py-2.5 rounded-lg text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 transition w-full`}
            >
              <div className="w-9 h-9 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0">
                <FaBars className="text-lg" />
              </div>
              {isExpanded && <span className="font-medium text-sm">Side Bar</span>}
            </a>
          </li>

          <li>
            <a
              href="#"
              className={`flex items-center ${
                isExpanded ? 'justify-start px-3' : 'justify-center'
              } gap-3 py-2.5 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-700 transition w-full`}
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center flex-shrink-0">
                <FaSearch className="text-lg" />
              </div>
              {isExpanded && <span className="font-medium text-sm">Search Bar</span>}
            </a>
          </li>

          <li>
            <a
              href="#"
              className={`flex items-center ${
                isExpanded ? 'justify-start px-3' : 'justify-center'
              } gap-3 py-2.5 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition w-full`}
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <FaBullhorn className="text-lg" />
              </div>
              {isExpanded && <span className="font-medium text-sm">Announcement</span>}
            </a>
          </li>

          <li>
            <a
              href="#"
              className={`flex items-center ${
                isExpanded ? 'justify-start px-3' : 'justify-center'
              } gap-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium w-full`}
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FaExpandArrowsAlt className="text-lg" />
              </div>
              {isExpanded && <span className="font-medium text-sm">Full Screen</span>}
            </a>
          </li>

          {/* If you add more items later, consider making collapse mandatory on mobile or adding scroll only then */}
        </ul>
      </nav>

      {/* Footer – only visible when expanded */}
      {isExpanded && (
        <div>
            <p className="text-xs text-blue-500 mt-2">Skyla &reg; : smart ecosystem</p>
        </div>
      )}
    </aside>
  );
}