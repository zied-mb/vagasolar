import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiLock, FiMail, FiEye, FiEyeOff, FiAlertTriangle, FiClock } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form,        setForm]     = useState({ email: '', password: '', website_url: '' });
  const [showPass,    setShowPass] = useState(false);
  const [loading,     setLoading]  = useState(false);
  const [error,       setError]    = useState('');
  // Server-driven countdown: number of seconds remaining until the IP is unblocked.
  // Set from the `retryAfter` field in the 429 response — never hardcoded.
  const [countdown,   setCountdown] = useState(0);
  const countdownRef                = useRef(null);

  const isLocked = countdown > 0;

  // Tick the countdown down every second; clear when it reaches 0.
  useEffect(() => {
    if (countdown <= 0) return;
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [countdown]);

  // Format seconds as mm:ss for display
  const formatCountdown = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec.toString().padStart(2, '0')}s` : `${sec}s`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // HoneyPot — silently abort if a bot filled this hidden field
    if (form.website_url !== '') return;
    if (isLocked || loading) return;

    setLoading(true);
    setError('');

    try {
      const res  = await fetch(`${API_URL}/api/auth/login`, {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (res.status === 429) {
        // Rate-limited: use the server-provided retryAfter (seconds) to drive
        // the countdown. This is specific to THIS IP — other users are unaffected.
        const seconds = data.retryAfter || 900;
        setCountdown(seconds);
        setError(data.message || `IP bloquée. Réessayez dans ${formatCountdown(seconds)}.`);
        return;
      }

      if (!res.ok) {
        setError(data.message || 'Identifiants incorrects.');
        return;
      }

      navigate('/admin/dashboard', { replace: true });
    } catch {
      setError('Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#d4af3710_0%,_transparent_70%)]"/>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"/>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"/>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/8 shadow-2xl shadow-black/60 overflow-hidden">
          {/* Gold top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"/>

          <div className="p-10">
            {/* Logo */}
            <div className="text-center mb-10">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 mb-5 shadow-xl shadow-amber-500/30"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FiSun className="text-black" size={28}/>
              </motion.div>
              <h1 className="text-2xl font-extrabold text-white">VagaSolar Admin</h1>
              <p className="text-gray-400 text-sm mt-1">Tableau de bord privé</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* HoneyPot trap — invisible to users, visible to bots */}
              <input
                type="text"
                name="website_url"
                className="opacity-0 absolute top-[-9999px] left-[-9999px]"
                tabIndex="-1"
                autoComplete="off"
                value={form.website_url}
                onChange={(e) => setForm((p) => ({ ...p, website_url: e.target.value }))}
              />

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="admin@vagasolar.tn"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-800/60 border border-white/8 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mot de passe</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                  <input
                    id="admin-password"
                    type={showPass ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-800/60 border border-white/8 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPass ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                  >
                    <FiAlertTriangle className="shrink-0 mt-0.5" size={14}/>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading || isLocked}
                whileHover={(!loading && !isLocked) ? { scale: 1.02 } : {}}
                whileTap={(!loading && !isLocked) ? { scale: 0.98 } : {}}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Connexion...
                  </span>
                ) : isLocked ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiClock size={15} />
                    Réessayez dans {formatCountdown(countdown)}
                  </span>
                ) : 'Accéder au tableau de bord'}
              </motion.button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-8">⚡ Accès restreint — Vaga Solar SRL</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
