import { useState } from 'react';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, getError } from '../services/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api.post('/auth/forgot-password', { email });
      toast.success(r.data.message);
    } catch (error) {
      toast.error(getError(error));
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-icon">
          <KeyRound />
        </div>
        <h1>Reset your password</h1>
        <p className="auth-subtitle">
          Enter your email and we’ll send you a secure reset link.
        </p>
        <label className="field">
          <span>Email address</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </label>
        <button className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
        <p className="auth-footer">
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </main>
  );
}
