"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";

interface Team {
  id: string;
  name: string;
  w: number;
  d: number;
  l: number;
  points: number;
  gd: number;
  rank: number;
}

// Fixed: Moved outside the component so it has a stable reference.
// This prevents the ESLint 'missing dependency' error and infinite loops.
const ALL_TABLES = ["teamsranked", "teamgroup1", "teamgroup2", "teamgroup3", "teamgroup4"];

export default function Teams() {
  const [groups, setGroups] = useState<{ [key: string]: Team[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const fetchedData: { [key: string]: Team[] } = {};

        await Promise.all(
          ALL_TABLES.map(async (table) => {
            const { data, error } = await supabase
              .from(table)
              .select("*")
              .order("points", { ascending: false });

            if (error) throw error;
            fetchedData[table] = data || [];
          })
        );

        setGroups(fetchedData);
      } catch (err: any) {
        setError("Failed to load standings.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array is now valid because ALL_TABLES is external

return (
  <main className="mt-5 bg-black text-white min-vh-100">
    <Navbar />

    <div className="container py-5">
      <h1 className="h3 fw-bold text-primary mb-3 text-center">Tournament Journey</h1>

      {/* Progress stepper – gives that "progressing through stages" baby feel */}
      <div className="mb-5">
        <ul className="stepper d-flex justify-content-between px-0" style={{ listStyle: 'none' }}>
          <li className="stepper-step text-center flex-fill">
            <div className="stepper-head bg-dark rounded-circle d-inline-flex align-items-center justify-content-center border border-primary border-2" style={{ width: '50px', height: '50px' }}>
              <span className="text-primary fw-bold">1</span>
            </div>
            <div className="stepper-text mt-2 small text-muted">Groups</div>
          </li>
          <li className="stepper-step text-center flex-fill">
            <div className="stepper-connector bg-gradient-primary" style={{ height: '4px', marginTop: '23px' }}></div>
            <div className="stepper-head bg-dark rounded-circle d-inline-flex align-items-center justify-content-center border border-primary border-2" style={{ width: '50px', height: '50px' }}>
              <span className="text-primary fw-bold">2</span>
            </div>
            <div className="stepper-text mt-2 small text-muted">Quarter</div>
          </li>
          <li className="stepper-step text-center flex-fill">
            <div className="stepper-connector bg-gradient-primary" style={{ height: '4px', marginTop: '23px' }}></div>
            <div className="stepper-head bg-dark rounded-circle d-inline-flex align-items-center justify-content-center border border-primary border-2 opacity-75" style={{ width: '50px', height: '50px' }}>
              <span className="text-primary fw-bold">3</span>
            </div>
            <div className="stepper-text mt-2 small text-muted">Semi</div>
          </li>
          <li className="stepper-step text-center flex-fill">
            <div className="stepper-connector bg-gradient-primary" style={{ height: '4px', marginTop: '23px' }}></div>
            <div className="stepper-head bg-dark rounded-circle d-inline-flex align-items-center justify-content-center border border-primary border-2 opacity-50" style={{ width: '50px', height: '50px' }}>
              <span className="text-primary fw-bold">4</span>
            </div>
            <div className="stepper-text mt-2 small text-muted">Final</div>
          </li>
          <li className="stepper-step text-center flex-fill">
            <div className="stepper-connector bg-gradient-primary" style={{ height: '4px', marginTop: '23px' }}></div>
            <div className="stepper-head bg-dark rounded-circle d-inline-flex align-items-center justify-content-center border border-primary border-2 opacity-25" style={{ width: '50px', height: '50px' }}>
              <span className="text-primary fw-bold">5</span>
            </div>
            <div className="stepper-text mt-2 small text-muted">3rd Place</div>
          </li>
          <li className="stepper-step text-center flex-fill">
            <div className="stepper-connector bg-gradient-primary" style={{ height: '4px', marginTop: '23px' }}></div>
            <div className="stepper-head bg-dark rounded-circle d-inline-flex align-items-center justify-content-center border border-primary border-2 opacity-25" style={{ width: '50px', height: '50px' }}>
              <span className="text-primary fw-bold">🏆</span>
            </div>
            <div className="stepper-text mt-2 small text-muted">Final Standings</div>
          </li>
        </ul>
      </div>

      {/* Enhanced nav-pills tabs – more modern & glowing on active */}
      <ul className="nav nav-pills nav-fill mb-4 border-bottom border-primary pb-3" id="tournamentTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active rounded-pill shadow-sm"
            id="group-tab"
            data-bs-toggle="pill"
            data-bs-target="#group"
            type="button"
            role="tab"
            aria-controls="group"
            aria-selected="true"
          >
            Group Stage
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link rounded-pill shadow-sm"
            id="quarter-tab"
            data-bs-toggle="pill"
            data-bs-target="#quarter"
            type="button"
            role="tab"
            aria-controls="quarter"
          >
            Quarter-finals
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link rounded-pill shadow-sm"
            id="semi-tab"
            data-bs-toggle="pill"
            data-bs-target="#semi"
            type="button"
            role="tab"
            aria-controls="semi"
          >
            Semi-finals
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link rounded-pill shadow-sm"
            id="final-tab"
            data-bs-toggle="pill"
            data-bs-target="#final"
            type="button"
            role="tab"
            aria-controls="final"
          >
            Final
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link rounded-pill shadow-sm"
            id="third-tab"
            data-bs-toggle="pill"
            data-bs-target="#third"
            type="button"
            role="tab"
            aria-controls="third"
          >
            Third Place
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link rounded-pill shadow-sm"
            id="results-tab"
            data-bs-toggle="pill"
            data-bs-target="#results"
            type="button"
            role="tab"
            aria-controls="results"
          >
            Final Standings
          </button>
        </li>
      </ul>

      {/* Tab content with deeper dark theme contrast */}
      <div className="tab-content" id="tournamentTabContent">
        {/* Group Stage – active by default */}
        <div className="tab-pane fade show active" id="group" role="tabpanel" aria-labelledby="group-tab">
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary spinner-border-lg"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger border-primary">{error}</div>
          ) : (
            ALL_TABLES.map((table) => (
              <div key={table} className="mb-5 card bg-dark border border-primary border-opacity-50 shadow">
                <div className="card-header bg-gradient-primary text-black fw-bold text-uppercase">
                  {table === "teamsranked" ? "Overall Standings" : `Group ${table.slice(-1)}`}
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-dark table-hover table-bordered mb-0 align-middle">
                      <thead className="table-primary text-black">
                        <tr>
                          <th className="text-center">Rank</th>
                          <th>Team Name</th>
                          <th className="text-center">W</th>
                          <th className="text-center">D</th>
                          <th className="text-center">L</th>
                          <th className="text-center">PTS</th>
                          <th className="text-center">GD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groups[table]?.map((team) => (
                          <tr key={team.id} className="hover-glow">
                            <td className="text-center fw-bold">{team.rank}</td>
                            <td className="fw-medium">{team.name}</td>
                            <td className="text-center">{team.w}</td>
                            <td className="text-center">{team.d}</td>
                            <td className="text-center">{team.l}</td>
                            <td className="text-center fw-bold text-primary">{team.points}</td>
                            <td className="text-center">{team.gd}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quarter-finals – placeholder with progressive hint */}
        <div className="tab-pane fade" id="quarter" role="tabpanel" aria-labelledby="quarter-tab">
          <div className="text-center py-5">
            <h3 className="text-primary mb-4">Quarter-finals – The Knockout Begins</h3>
            <p className="lead text-muted">Top teams battle it out. Winners advance to the semis...</p>
            {/* Replace with real bracket or match list later */}
          </div>
        </div>

        <div className="tab-pane fade" id="semi" role="tabpanel" aria-labelledby="semi-tab">
          <div className="text-center py-5">
            <h3 className="text-primary mb-4">Semi-finals – One Step from Glory</h3>
            <p className="lead text-muted">High stakes. Only four remain...</p>
          </div>
        </div>

        <div className="tab-pane fade" id="final" role="tabpanel" aria-labelledby="final-tab">
          <div className="text-center py-5">
            <h3 className="text-primary mb-4">The Final – Destiny Awaits</h3>
            <p className="lead text-muted">The ultimate showdown for the trophy.</p>
          </div>
        </div>

        <div className="tab-pane fade" id="third" role="tabpanel" aria-labelledby="third-tab">
          <div className="text-center py-5">
            <h3 className="text-primary mb-4">Third Place Play-off</h3>
            <p className="lead text-muted">Pride on the line – bronze medal match.</p>
          </div>
        </div>

        <div className="tab-pane fade" id="results" role="tabpanel" aria-labelledby="results-tab">
          <div className="text-center py-5">
            <h3 className="text-primary mb-4">Final Tournament Standings</h3>
            <p className="lead text-muted">Champion crowned. Full results & rankings here...</p>
            {/* → Add overall winner announcement, podium, full results table, etc. */}
          </div>
        </div>
      </div>
    </div>

    {/* Optional extra CSS – add to your global stylesheet or <style> tag */}
    <style>{`
      .bg-gradient-primary {
        background: linear-gradient(90deg, #0d6efd, #6610f2);
      }
      .nav-link.active {
        background: linear-gradient(45deg, #0d6efd, #6610f2) !important;
        color: white !important;
        transform: scale(1.08);
        transition: all 0.3s ease;
      }
      .nav-link:hover {
        transform: scale(1.05);
        transition: all 0.2s ease;
      }
      .stepper-connector {
        background: linear-gradient(to right, #0d6efd, #6610f2);
      }
      .hover-glow:hover {
        background-color: rgba(13, 110, 253, 0.15) !important;
        box-shadow: 0 0 15px rgba(13, 110, 253, 0.4);
      }
      .card {
        transition: transform 0.3s ease;
      }
      .card:hover {
        transform: translateY(-5px);
      }
    `}</style>
  </main>
);
}