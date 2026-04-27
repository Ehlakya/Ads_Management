import React from 'react';
import { LogOut, Bell, User, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search for ads, users..." className="search-input" />
      </div>

      <div className="nav-actions">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">{user?.role || 'Super Admin'}</span>
          </div>
          <div className="avatar">
            {user?.name?.[0] || 'A'}
          </div>
        </div>

        <button onClick={logout} className="logout-btn">
          <LogOut size={20} />
        </button>
      </div>

      <style>{`
        .navbar {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
        }

        .search-container {
          position: relative;
          width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          padding-left: 40px;
          background: var(--background);
          border: 1px solid var(--border);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-btn {
          background: none;
          color: var(--text-muted);
          padding: 8px;
          border-radius: 8px;
        }

        .icon-btn:hover {
          color: var(--text);
          background: var(--glass);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 4px 12px;
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
        }

        .logout-btn {
          background: none;
          color: var(--error);
          padding: 8px;
          border-radius: 8px;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
