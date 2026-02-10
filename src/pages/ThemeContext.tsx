import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [accentHue, setAccentHue] = useState(210);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    setAccentHue(Math.floor(Math.random() * 360));
  };

  // ← This is the key change
  const theme = useMemo(
    () => ({
      primary: `hsl(${accentHue}, 80%, 60%)`,
      bg: isDarkMode ? '#0a0f1a' : '#ffffff',
      cardBg: isDarkMode ? '#161e2d' : '#f1f5f9',
      text: isDarkMode ? '#f8fafc' : '#0f172a',
      isDarkMode,
    }),
    [accentHue, isDarkMode]   // only these values matter
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--card-bg', theme.cardBg);
    root.style.setProperty('--text', theme.text);
    document.body.style.backgroundColor = theme.bg;
  }, [theme]);   // now safe — theme only changes when needed

  return (
    <ThemeContext.Provider value={{ theme, generateRandomTheme: toggleTheme }}>
      <div className="transition-colors duration-500" style={{ color: 'var(--text)' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);