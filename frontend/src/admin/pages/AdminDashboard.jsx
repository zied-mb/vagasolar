import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import {
  FiUsers, FiMessageSquare, FiZap, FiArrowRight,
  FiFolder, FiTrash2, FiEye, FiMail, FiCalendar, FiActivity, FiTrendingUp
} from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─── Singleton promise to prevent double-fetching on mount ──────────────────
let dashboardPromise = null;

// ─── Skeleton Components ──────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-gray-900 border border-white/8 rounded-2xl p-4 sm:p-6 animate-pulse">
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 mb-4" />
    <div className="h-6 sm:h-8 w-16 bg-white/5 rounded-lg mb-2" />
    <div className="h-3 w-24 bg-white/5 rounded-lg" />
  </div>
);

const SkeletonRow = () => (
  <tr className="border-b border-white/5">
    {[1, 2, 3, 4].map((i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-3 bg-white/5 rounded-lg animate-pulse" style={{ width: `${60 + i * 10}%` }} />
      </td>
    ))}
  </tr>
);

const SkeletonMessage = () => (
  <div className="px-6 py-4 flex items-start gap-3 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-white/5 rounded w-3/4" />
      <div className="h-2 bg-white/5 rounded w-1/2" />
    </div>
  </div>
);

// ─── Gold Tooltip for Chart ───────────────────────────────────────────────────
const GoldTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-amber-400/30 rounded-xl px-4 py-2 shadow-xl shadow-black/40">
        <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">{label}</p>
        <p className="text-white text-lg font-extrabold mt-0.5">{payload[0].value} lead{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

// ─── StatCard (design unchanged + badge) ─────────────────────────────────────
const StatCard = ({ icon, label, value, sub, badge, color }) => (
  <motion.div whileHover={{ y: -4 }} className={`bg-gray-900 border border-white/8 rounded-2xl p-4 sm:p-6 ${color} relative`}>
    {badge > 0 && (
      <span className="absolute top-2 right-2 sm:top-4 sm:right-4 min-w-[18px] h-[18px] sm:min-w-[22px] sm:h-[22px] px-1 sm:px-1.5 bg-amber-400 text-black text-[9px] sm:text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-amber-400/30">
        {badge}
      </span>
    )}
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className="p-2 sm:p-2.5 bg-white/5 rounded-xl text-lg sm:text-xl">{icon}</div>
    </div>
    <p className="text-2xl sm:text-3xl font-extrabold text-white">{value}</p>
    <p className="text-[10px] sm:text-sm text-gray-400 mt-1 uppercase tracking-wider font-bold">{label}</p>
    {sub && <p className="text-[9px] sm:text-xs mt-2 opacity-70 truncate">{sub}</p>}
  </motion.div>
);

const STATUS_COLORS = {
  new: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  quote_sent: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  closed: 'bg-green-500/20 text-green-400 border border-green-500/30',
};
const STATUS_LABELS = { new: 'Nouveau', contacted: 'Contacté', quote_sent: 'Devis Envoyé', closed: 'Clôturé' };

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = (silent = false) => {
    if (dashboardPromise && !silent) return; // Deduplicate non-silent calls

    if (!silent) setLoading(true);

    dashboardPromise = fetch(`${API_URL}/api/stats/dashboard`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setStats(d.stats);
        }
      })
      .catch((err) => console.error('Dashboard state fetch failed:', err))
      .finally(() => {
        setLoading(false);
        dashboardPromise = null;
      });
  };

  useEffect(() => { fetchDashboardStats(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });
      if (res.ok) {
        fetchDashboardStats(true);
      }
    } catch (err) { console.error('Status update failed:', err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce lead ?')) return;
    try {
      const res = await fetch(`${API_URL}/api/leads/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        fetchDashboardStats(true);
      }
    } catch (err) { console.error('Deletion failed:', err); }
  };

  const recentLeads = (stats?.leads?.recent || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  const recentMessages = (stats?.messages?.recent || []).slice(0, 3);
  const leadGrowth = stats?.leadGrowth || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Bienvenue dans votre centre de commande, Zied.</p>
        </div>
        <button
          onClick={() => fetchDashboardStats(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-white/5 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
        >
          <FiActivity size={14} /> Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={<FiUsers className="text-blue-400" />}
              label="Leads Simulateur"
              value={stats?.leads?.total || 0}
              sub={`Nouveaux: ${stats?.leads?.new || 0}`}
              badge={stats?.leads?.new || 0}
              color="border-l-4 border-l-blue-500/50"
            />
            <StatCard
              icon={<FiZap className="text-amber-400" />}
              label="Abonnés Newsletter"
              value={stats?.subscribers?.total || 0}
              color="border-l-4 border-l-amber-500/50"
            />
            <StatCard
              icon={<FiFolder className="text-purple-400" />}
              label="Projets Publiés"
              value={stats?.projects?.published || 0}
              sub={`Brouillons: ${stats?.projects?.draft || 0}`}
              color="border-l-4 border-l-purple-500/50"
            />
            <StatCard
              icon={<FiMessageSquare className="text-green-400" />}
              label="Messages & Témoignages"
              value={stats?.messages?.total || 0}
              sub={`Témoignages: ${stats?.testimonials?.total || 0}`}
              color="border-l-4 border-l-green-500/50"
            />
          </>
        )}
      </div>


      {/* Bottom Grid: Leads (2/3) + Messages (1/3) — ABOVE the chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Leads Table */}
        <div className="xl:col-span-2 bg-gray-900 border border-white/8 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-bold text-white text-lg">Leads Récents</h2>
            <Link to="/admin/leads" className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1 transition-colors">
              Voir tous <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Économies/An</th>
                  <th className="px-6 py-3 text-left">Statut</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
                ) : recentLeads.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-500 py-12">Aucun lead encore.</td></tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/admin/leads/${lead._id}`} className="text-white font-medium hover:text-amber-400 transition-colors">
                          {lead.prenom} {lead.nom}
                        </Link>
                        <p className="text-xs text-gray-500">{lead.telephone} · {new Date(lead.createdAt).toLocaleDateString('fr-TN')}</p>
                      </td>
                      <td className="px-6 py-4 text-amber-400 font-bold">
                        {lead.resultat?.savings?.annual ? `${Math.round(lead.resultat.savings.annual)} DT` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`appearance-none cursor-pointer outline-none px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[lead.status]}`}
                        >
                          {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                            <option key={val} value={val} className="bg-gray-900 text-white">{lbl}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/leads/${lead._id}`}
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-white/5"
                            title="Voir détails"
                          >
                            <FiEye size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(lead._id, `${lead.prenom} ${lead.nom}`)}
                            className="p-2 bg-gray-800 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-white/5"
                            title="Supprimer"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Messages Panel */}
        <div className="bg-gray-900 border border-white/8 rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-bold text-white text-lg">Messages Directs</h2>
            <Link to="/admin/messages" className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1 transition-colors">
              Voir tous <FiArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="divide-y divide-white/5 flex-1">
              {[1, 2, 3].map((i) => <SkeletonMessage key={i} />)}
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <p className="text-gray-500 text-sm">Aucun message reçu.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 flex-1">
              {recentMessages.map((msg) => (
                <div key={msg._id} className="px-6 py-4 hover:bg-white/3 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiMail size={13} className="text-amber-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-semibold truncate">{msg.name || 'Anonyme'}</p>
                      <p className="text-gray-500 text-xs truncate">{msg.subject || msg.email || '—'}</p>
                      <p className="text-gray-600 text-[10px] mt-1 flex items-center gap-1">
                        <FiCalendar size={9} />
                        {new Date(msg.createdAt).toLocaleDateString('fr-TN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-6 py-4 border-t border-white/5 mt-auto">
            <Link
              to="/admin/messages"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-white/5"
            >
              <FiMail size={13} /> Gérer la messagerie
            </Link>
          </div>
        </div>

      </div>

      {/* Lead Growth Chart — now below the activity tables */}
      <div className="bg-gray-900 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white/5 rounded-xl">
            <FiTrendingUp className="text-amber-400" size={18} />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">Croissance des Leads</h2>
            <p className="text-gray-500 text-xs">7 derniers jours</p>
          </div>
        </div>
        {loading ? (
          <div className="h-40 bg-white/3 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={leadGrowth} margin={{ top: 0, right: 8, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<GoldTooltip />} cursor={{ stroke: 'rgba(245,158,11,0.15)', strokeWidth: 2 }} />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="url(#goldGradient)"
                strokeWidth={2.5}
                dot={{ fill: '#f59e0b', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#f59e0b', stroke: '#000', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
