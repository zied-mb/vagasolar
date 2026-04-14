import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * ProtectedRoute — calls GET /api/auth/me to verify the httpOnly JWT cookie.
 * Renders children if authenticated, redirects to /admin/login otherwise.
 */
const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'auth' | 'unauth'

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })
      .then((r) => {
        if (r.ok) setStatus('auth');
        else      setStatus('unauth');
      })
      .catch(() => setStatus('unauth'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  return status === 'auth' ? children : <Navigate to="/admin/login" replace/>;
};

export default ProtectedRoute;
