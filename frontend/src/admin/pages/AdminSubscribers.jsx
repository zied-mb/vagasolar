import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiDownload, FiTrash2, FiUserCheck, FiMail } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/subscribers`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet abonné ?')) return;

    try {
      const res = await fetch(`${API_URL}/api/subscribers/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExport = () => {
    if (subscribers.length === 0) return;

    const date = new Date().toISOString().split('T')[0];
    const filename = `VagaSolar_Subscribers_${date}.csv`;
    
    // CSV content
    const headers = ['Email', 'Date d\'inscription'];
    const rows = subscribers.map(s => [
      s.email,
      new Date(s.subscriptionDate).toLocaleString('fr-TN')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Abonnés</h1>
          <p className="text-gray-400 mt-1">{subscribers.length} inscriptions à la newsletter</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-500 hover:to-yellow-600 transition-all text-sm"
        >
          <FiDownload size={15}/> Exporter CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15}/>
        <input 
          placeholder="Rechercher un email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-white/8 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-400/50 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-white/8 rounded-2xl overflow-hidden glass-morphism">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="text-center text-gray-500 py-16">Aucun abonné trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Abonné</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Date d'inscription</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubscribers.map((subscriber, index) => (
                  <motion.tr 
                    key={subscriber._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/3 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400">
                          <FiUserCheck size={18} />
                        </div>
                        <span className="font-semibold text-gray-200">Abonné #{subscribers.length - index}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiMail className="text-amber-400/50" />
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(subscriber.subscriptionDate).toLocaleDateString('fr-TN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(subscriber._id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscribers;
