import { useEffect,useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle2,Clock3 } from 'lucide-react';
import { api,getError } from '../services/api.js';

export default function VerifyEmail(){const[params]=useSearchParams();
    const token=params.get('token');
    const[state,setState]=useState(token?'loading':'idle');
    useEffect(()=>{if(!token)return;api.post('/auth/verify-email',{token}).then(()=>setState('success')).catch(e=>{setState('error');toast.error(getError(e))})},[token]);
    
    
    async function resend(){try{await api.post('/auth/resend-verification');toast.success('Verification email sent')}catch(e){toast.error(getError(e))}}return <main className="auth-page"><div className="auth-card status-card">{state==='success'?<CheckCircle2/>:<Clock3/>}<h1>{state==='success'?'Email verified':state==='error'?'Link expired or invalid':'Verify your email'}</h1><p>{state==='success'?'Your email address has been confirmed. You can now use every SecureAuth feature.':state==='error'?'Request a new verification email or check your inbox for the latest link.':'We sent a secure verification link to your email address.'}</p>{state!=='success'&&<button className="btn btn-primary btn-full" onClick={resend}>Resend verification email</button>}</div></main>}
