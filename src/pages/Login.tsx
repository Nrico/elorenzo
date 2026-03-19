import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      });

      if (!res.ok) {
        throw new Error('Invalid passphrase');
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        onLogin(data.token);
        navigate('/admin');
      }
    } catch (err) {
      setError('Incorrect passphrase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 border-t-4 border-black shadow-2xl"
      >
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-center">Studio Access</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Passphrase
            </label>
            <input
              type="password"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              className="w-full bg-slate-100 border-none p-4 text-center text-xl font-bold tracking-widest outline-none focus:ring-2 focus:ring-black transition-shadow"
              placeholder="••••••••"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !passphrase}
            className="w-full bg-black text-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Studio'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
