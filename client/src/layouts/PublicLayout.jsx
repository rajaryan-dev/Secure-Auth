import { Link, Outlet } from 'react-router-dom';
import { Logo } from '../components/UI.jsx';
export default function PublicLayout() { return <><nav className="public-nav"><Logo/><div><Link className="btn btn-secondary nav-login" to="/login">Log in</Link><Link className="btn btn-primary" to="/register">Get started</Link></div></nav><Outlet/></>; }
