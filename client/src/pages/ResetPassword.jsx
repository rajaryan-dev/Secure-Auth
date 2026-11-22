import { useState } from 'react';
import { useSearchParams,Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PasswordField,strength } from '../components/UI.jsx';
import { api,getError } from '../services/api.js';

export default function ResetPassword(){const[params]=useSearchParams();
    const[token]=useState(params.get('token')||'');
    const[password,setPassword]=useState('');
    const[confirm,setConfirm]=useState('');
    const[loading,setLoading]=useState(false); 
    async function submit(e){e.preventDefault();
        if(strength(password)<3)return toast.error('Use a stronger password');
        if(password!==confirm)return toast.error('Passwords do not match');setLoading(true);
        try{await api.post('/auth/reset-password',{token,password});
        
        toast.success('Password reset successfully');}catch(e){toast.error(getError(e))}finally{setLoading(false)}}return <main className="auth-page"><form className="auth-card" onSubmit={submit}><h1>Choose a new password</h1><p className="auth-subtitle">Your reset link is only valid for one hour.</p><PasswordField value={password} onChange={e=>setPassword(e.target.value)} placeholder="New password"/><PasswordField label="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat new password"/><button className="btn btn-primary btn-full" disabled={loading||!token}>{loading?'Resetting…':'Reset password'}</button>{!token&&<p className="auth-footer">This reset link is missing or invalid.</p>}<p className="auth-footer"><Link to="/login">Back to login</Link></p></form></main>}
