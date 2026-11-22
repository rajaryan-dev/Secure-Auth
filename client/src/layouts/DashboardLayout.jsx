import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo } from '../components/UI.jsx';

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const handleLogout = async () => { await logout(); window.location.href = '/login'; };
  return <div className="dashboard-shell">
    <aside className={`sidebar ${open ? 'open' : ''}`}><div className="sidebar-top"><Logo light/><button className="sidebar-close" onClick={() => setOpen(false)}><X/></button></div>
      <nav><NavLink to="/dashboard" end><LayoutDashboard size={18}/> Overview</NavLink><NavLink to="/settings"><Settings size={18}/> Profile settings</NavLink></nav>
      <button className="logout" onClick={handleLogout}><LogOut size={18}/> Log out</button>
    </aside>
    {open && <div className="overlay" onClick={() => setOpen(false)}/>}<main className="dashboard-main"><header className="dashboard-header"><button className="menu-btn" onClick={() => setOpen(true)}><Menu/></button><div className="avatar">{user?.fullName?.charAt(0)?.toUpperCase()}</div></header><Outlet/></main>
  </div>;
}
