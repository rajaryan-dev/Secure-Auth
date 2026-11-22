import { Link } from 'react-router-dom';

import { Logo } from '../components/UI.jsx';
export default function NotFound(){return <main className="not-found"><Logo/><div><span>404</span><h1>Page not found</h1><p>The page you’re looking for doesn’t exist or has moved.</p><Link className="btn btn-primary" to="/">Return home</Link></div></main>}
