import { Eye, EyeOff } from 'lucide-react';

export function Logo({ light = false }) { return <a className="logo" href="/"><span className="logo-mark" style={light ? { background:'#fff' } : {}}>S</span><span style={light ? { color:'#fff' } : {}}>SecureAuth</span></a>; }
export function PasswordField({ label = 'Password', ...props }) {
  const [shown, setShown] = React.useState(false);
  return <label className="field"><span>{label}</span><div className="password-wrap"><input type={shown ? 'text' : 'password'} {...props}/><button type="button" className="icon-btn" aria-label={shown ? 'Hide password' : 'Show password'} onClick={() => setShown(v => !v)}>{shown ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>;
}
import React from 'react';

export function strength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}
