"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";

// Define the shape of our data
interface Team {
  id: string;
  name: string;
  w: number;
  d: number;
  l: number;
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error(error);
        setError("Failed to load league standings.");
      } else {
        setTeams(data || []);
      }
      setLoading(false);
    };

    fetchTeams();
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <Navbar />

      {/* Main Content Area */}
      <main style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>League Standings</h1>
          <p style={styles.subtitle}>E-Football Season 2026</p>
        </header>

        {loading ? (
          <div style={styles.message}>
            <div className="spinner"></div> {/* Add a spinner CSS class if you have one */}
            <p>Loading teams...</p>
          </div>
        ) : error ? (
          <div style={{ ...styles.message, color: "#dc3545" }}>{error}</div>
        ) : (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>Team Name</th>
                  <th style={styles.thCenter}>W</th>
                  <th style={styles.thCenter}>D</th>
                  <th style={styles.thCenter}>L</th>
                  <th style={styles.thPoints}>PTS</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={styles.emptyCell}>
                      No teams found.
                    </td>
                  </tr>
                ) : (
                  teams.map((team) => (
                    <tr key={team.id} style={styles.tr}>
                      <td style={styles.teamNameCell}>{team.name}</td>
                      <td style={styles.tdCenter}>{team.w}</td>
                      <td style={styles.tdCenter}>{team.d}</td>
                      <td style={styles.tdCenter}>{team.l}</td>
                      <td style={styles.pointsCell}>
                        {team.w * 3 + team.d}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// Industry-level styles
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f4f7f9",
  },
  container: {
    paddingTop: "90px", // Pushes content below the 60px fixed navbar
    paddingLeft: "20px",
    paddingRight: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1a1a1a",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#6c757d",
    marginTop: "5px",
  },
  tableCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    overflow: "hidden", // Rounds the table corners
    border: "1px solid #e0e0e0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  theadRow: {
    backgroundColor: "#1e293b",
    color: "#ffffff",
  },
  th: {
    padding: "16px",
    textAlign: "left" as const,
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  thCenter: {
    padding: "16px",
    textAlign: "center" as const,
    fontSize: "13px",
    fontWeight: "600",
    width: "60px",
  },
  thPoints: {
    padding: "16px",
    textAlign: "center" as const,
    fontSize: "13px",
    fontWeight: "700",
    backgroundColor: "#334155", // Slightly different color for points column
    width: "80px",
  },
  tr: {
    borderBottom: "1px solid #f0f0f0",
    transition: "background 0.2s",
  },
  teamNameCell: {
    padding: "16px",
    fontWeight: "600",
    color: "#0d6efd", // Football-style link/brand color
  },
  tdCenter: {
    padding: "16px",
    textAlign: "center" as const,
    color: "#4a5568",
  },
  pointsCell: {
    padding: "16px",
    textAlign: "center" as const,
    fontWeight: "800",
    color: "#1e293b",
    backgroundColor: "#f8fafc",
  },
  emptyCell: {
    padding: "40px",
    textAlign: "center" as const,
    color: "#94a3b8",
  },
  message: {
    textAlign: "center" as const,
    marginTop: "50px",
    fontSize: "18px",
    fontWeight: "500",
  },
};