import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useTheme } from '../pages/ThemeContext.tsx';
import { UserPlus } from 'lucide-react';

export default function UserDiscovery() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('id, display_name, avatar_url, cover_url, bio').limit(20);
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="row g-4">
      {users.map((user) => (
        <div key={user.id} className="col-md-6 col-lg-4">
          <div className="card h-100 border-0 shadow-sm" style={{ backgroundColor: theme.cardBg, borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ height: '80px', backgroundImage: `url(${user.cover_url || 'https://images.unsplash.com/photo-1557683316-973673baf926'})`, backgroundSize: 'cover' }} />
            <div className="card-body text-center pt-0" style={{ marginTop: '-40px' }}>
              <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.display_name}`} 
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: `4px solid ${theme.cardBg}`, objectFit: 'cover' }} alt="" />
              <h5 className="mt-2 fw-bold mb-0" style={{ color: theme.text }}>{user.display_name}</h5>
              <p className="small opacity-50 mb-3" style={{ height: '40px', overflow: 'hidden' }}>{user.bio || "Student at Kibabii University"}</p>
              <div className="d-flex gap-2 justify-content-center">
                <Link to={`/profileview/${user.id}`} className="btn btn-sm px-3 rounded-pill" style={{ backgroundColor: `${theme.primary}22`, color: theme.primary }}>View</Link>
                <button className="btn btn-primary btn-sm px-3 rounded-pill d-flex align-items-center gap-1">
                  <UserPlus size={14} /> Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}