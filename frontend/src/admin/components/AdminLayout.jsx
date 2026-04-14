import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiUsers, FiZap, FiFolder, FiMessageSquare, FiMail,
  FiLogOut, FiMenu, FiX, FiSun,
} from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const NAV = [
  { to: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/admin/leads', icon: <FiUsers />, label: 'Leads' },
  { to: '/admin/messages', icon: <FiMail />, label: 'Messagerie' },
  { to: '/admin/steg-rates', icon: <FiZap />, label: 'Tarifs STEG' },
  { to: '/admin/projects', icon: <FiFolder />, label: 'Projets' },
  { to: '/admin/testimonials', icon: <FiMessageSquare />, label: 'Témoignages' },
  { to: '/admin/subscribers', icon: <FiUsers />, label: 'Abonnés' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-7 border-b border-white/10">
        <img
          src="/favicon.png"
          alt="VagaSolar Logo"
          className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-amber-500/20"
        />
        <div>
          <p className="font-extrabold text-white tracking-tight text-sm leading-tight">VagaSolar</p>
          <p className="text-[10px] text-yellow-400/80 font-medium uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>

      {/* Nav - Grows to push logout down */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                ? 'bg-gradient-to-r from-amber-400/20 to-yellow-500/10 text-amber-400 border border-amber-400/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout - Pinned to bottom */}
      <div className="px-4 py-5 border-t border-white/10 mt-auto bg-gray-900/50">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <FiLogOut /> Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex text-white">

      {/* Desktop Sidebar — sticky, never scrolls */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900/80 border-r border-white/5 backdrop-blur-sm shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} />
            <motion.aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 z-50 lg:hidden flex flex-col" initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"><FiX size={20} /></button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-gray-900/50 border-b border-white/5 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white"><FiMenu size={20} /></button>
          <div className="ml-auto text-right">
            <p className="text-sm font-semibold text-white">Zied Meddeb</p>
            <p className="text-xs text-yellow-400">Administrateur</p>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <motion.div key="page-content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
