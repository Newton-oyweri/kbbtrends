import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check session on mount
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/"); // redirect to auth page
      } else {
        setUser(data.session.user);
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes (logout in another tab)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) navigate("/");
        else setUser(session.user);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return <p style={{ padding: 40 }}>Checking authentication...</p>;
  }

  // Pass the user as a prop to the child
  return React.cloneElement(children, { user });
}
