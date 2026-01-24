import { supabase } from "../supabase";
import Navbar from "../components/Navbar";
export default function Dashboard({ user }) {
  return (
    <div style={{ padding: 40 }}>
        <Navbar />  
      <h1>Dashboard</h1>
      <p>Logged in as: <b>{user.email}</b></p>
      <button onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}>
        Log out
      </button>
    </div>
  );
}
