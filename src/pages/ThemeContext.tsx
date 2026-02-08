import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext<any>(null);

const fonts = [
  "'Inter', sans-serif",
  "'Playfair Display', serif",
  "'JetBrains Mono', monospace",
  "'Lexend', sans-serif",
  "'Space Grotesk', sans-serif",
  "'Poppins', sans-serif",
  "'Raleway', sans-serif",
  "'Manrope', sans-serif",
];

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Start with a nice default
  const [theme, setTheme] = useState({
    primary: '#6366f1',
    bg: '#f8fafc',
    cardBg: '#ffffff',
    text: '#1e293b',
    glow: 'rgba(99, 102, 241, 0.2)',
    font: fonts[0],
  });

  const generateRandomTheme = () => {
    // 1. Random hue (full circle)
    const hue = Math.floor(Math.random() * 360);

    // 2. More varied saturation — sometimes pastel, sometimes vivid
    const saturation = Math.floor(Math.random() * 40 + 55); // 55–95%

    // 3. Primary lightness — avoid too dark or too washed out
    const lightness = Math.floor(Math.random() * 30 + 45); // 45–75%

    // 4. Sometimes generate a more muted/accent color instead of super bright
    const isMuted = Math.random() < 0.35;
    const primarySat = isMuted ? Math.floor(Math.random() * 40 + 30) : saturation;
    const primaryLight = isMuted ? Math.floor(Math.random() * 20 + 60) : lightness;

    const primary = `hsl(${hue}, ${primarySat}%, ${primaryLight}%)`;

    // 5. Background — subtle tint based on hue, but very desaturated & light
    const bgSat = Math.floor(Math.random() * 25 + 5);     // 5–30%
    const bgLight = Math.floor(Math.random() * 12 + 94);   // 94–100%
    const bg = `hsl(${hue}, ${bgSat}%, ${bgLight}%)`;

    // 6. Text — dark version of hue, but ensure readability
    const textLightness = Math.random() < 0.3 ? 10 : 12; // sometimes almost black
    const text = `hsl(${hue}, ${Math.floor(saturation * 0.7)}%, ${textLightness}%)`;

    // 7. Glow — more transparent & based on primary
    const glow = `hsla(${hue}, ${primarySat}%, ${primaryLight}%, ${Math.random() * 0.15 + 0.15})`; // 0.15–0.3

    // 8. Card background — usually white/off-white, sometimes very light tinted
    const cardIsTinted = Math.random() < 0.25;
    const cardBg = cardIsTinted
      ? `hsl(${hue}, ${bgSat * 1.5}%, ${bgLight - 3}%)`
      : '#ffffff';

    // 9. Random font
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];

    setTheme({
      primary,
      bg,
      cardBg,
      text,
      glow,
      font: randomFont,
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, generateRandomTheme }}>
      <div
        style={{
          color: theme.text,
          fontFamily: theme.font,
          backgroundColor: theme.bg,
        }}
        className="transition-all duration-700 min-h-screen"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};