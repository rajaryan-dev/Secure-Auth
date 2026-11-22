import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';

import { PasswordField } from '../components/UI.jsx';
import { api,getError } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
export default function Login()
{const [form,setForm]=useState({email:'',password:'',remember:false});const [loading,setLoading]=useState(false);const {setUser}=useAuth();const navigate=useNavigate();async function submit(e){e.preventDefault();setLoading(true);try{const r=await api.post('/auth/login',form);setUser(r.data.data.user);toast.success('Welcome back');navigate('/dashboard');}catch(e){toast.error(getError(e))}finally{setLoading(false)}}return <main className="auth-page"><form className="auth-card" onSubmit={submit}><div className="auth-icon"><ShieldCheck/></div><h1>Welcome back</h1><p className="auth-subtitle">Log in to your SecureAuth account.</p><label className="field"><span>Email address</span><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required/></label><PasswordField value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/><div className="form-row"><label className="check"><input type="checkbox" checked={form.remember} onChange={e=>setForm({...form,remember:e.target.checked})}/><span>Remember me</span></label><Link to="/forgot-password">Forgot password?</Link></div><button className="btn btn-primary btn-full" disabled={loading}>{loading?'Signing in…':'Log in'}</button><p className="auth-footer">New to SecureAuth? <Link to="/register">Create account</Link></p></form></main>}
