import React from "react";
import Navbar from "../components/Navbar.tsx";
import { useTheme } from "./ThemeContext.tsx";

export default function Profile() {
  const { theme } = useTheme();

  return (
    <div
      className="flex h-screen w-full overflow-hidden transition-all duration-700"
      style={{ backgroundColor: theme.bg, fontFamily: theme.font, color: theme.text }}
    >
      <Navbar />

      <main
        className="flex-1 overflow-y-auto transition-all duration-700 relative"
      >
        <div className="p-6 md:p-8 lg:p-10">
          <h1           className="text-3xl font-bold mb-6" style={{ color: theme.text }}>
            Profile
          </h1>

          <p className="text-lg mb-8 opacity-75" style={{ color: theme.text }}>
            This is the profile page.
          </p>
        </div>
      </main>
    </div>
  );   } 