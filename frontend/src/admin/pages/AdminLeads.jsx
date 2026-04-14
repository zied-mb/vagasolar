import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiDownload, FiEye, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const STATUS_COLORS = {
  new:        'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  contacted:  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  quote_sent: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  closed:     'bg-green-500/20 text-green-400 border border-green-500/30',
};
const STATUS_LABELS = { new:'Nouveau', contacted:'Contacté', quote_sent:'Devis Envoyé', closed:'Clôturé' };
const ALL_STATUSES  = ['all', 'new', 'contacted', 'quote_sent', 'closed'];

const AdminLeads = () => {
  const [leads,    setLeads]    = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('all');
  const [page,     setPage]     = useState(1);
  const limit = 20;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit, ...(search && {search}), ...(status !== 'all' && {status}) });
      const res  = await fetch(`${API_URL}/api/leads?${params}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) { setLeads(data.leads); setTotal(data.total); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleExport = () => {
    window.open(`${API_URL}/api/leads/export`, '_blank');
  };

  const updateStatus = async (id, newStatus) => {
    await fetch(`${API_URL}/api/leads/${id}/status`, {
      method:'PATCH', credentials:'include',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ status: newStatus }),
    });
    fetchLeads();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Leads</h1>
          <p className="text-gray-400 mt-1">{total} contacts capturés via le simulateur</p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-500 hover:to-yellow-600 transition-all text-sm"
        >
          <FiDownload size={15}/> Exporter Excel
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15}/>
          <input placeholder="Rechercher nom, téléphone, email..." value={search}
            onChange={(e)=>{setSearch(e.target.value);setPage(1);}}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-white/8 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-400/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FiFilter className="text-gray-500" size={15}/>
          {ALL_STATUSES.map((s) => (
            <button key={s} onClick={()=>{setStatus(s);setPage(1);}}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${status===s ? 'bg-amber-400 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >{s==='all'?'Tous':STATUS_LABELS[s]}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"/></div>
        ) : leads.length === 0 ? (
          <div className="text-center text-gray-500 py-16">Aucun lead trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3.5 text-left">Client</th>
                <th className="px-5 py-3.5 text-left">Contact</th>
                <th className="px-5 py-3.5 text-left">Type</th>
                <th className="px-5 py-3.5 text-left">Conso</th>
                <th className="px-5 py-3.5 text-left">Économies/An</th>
                <th className="px-5 py-3.5 text-left">Statut</th>
                <th className="px-5 py-3.5 text-left">Date</th>
                <th className="px-5 py-3.5 text-left"/>
              </tr></thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <motion.tr key={lead._id} initial={{opacity:0}} animate={{opacity:1}} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 font-medium text-white">{lead.prenom} {lead.nom}</td>
                    <td className="px-5 py-4">
                      <a href={`tel:${lead.telephone}`} className="text-amber-400 hover:text-amber-300 block">{lead.telephone}</a>
                      <span className="text-gray-500 text-xs">{lead.email || '—'}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-300 capitalize">{lead.typeBatiment}</td>
                    <td className="px-5 py-4 text-gray-300">{lead.consommationMensuelle} kWh</td>
                    <td className="px-5 py-4 text-amber-400 font-bold">
                      {(lead.resultat?.savings?.annual !== undefined && lead.resultat?.savings?.annual !== null) 
                        ? `${Math.round(lead.resultat.savings.annual)} DT` 
                        : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <select value={lead.status} onChange={(e)=>updateStatus(lead._id,e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer bg-transparent border ${STATUS_COLORS[lead.status].replace('bg-','').split(' ')[0]} ${STATUS_COLORS[lead.status].split(' ').slice(1).join(' ')} transition-all`}
                      >
                        {Object.entries(STATUS_LABELS).map(([v,l])=><option key={v} value={v} className="bg-gray-900 text-white">{l}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString('fr-TN')}</td>
                    <td className="px-5 py-4">
                      <Link to={`/admin/leads/${lead._id}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-400 transition-colors">
                        <FiEye size={14}/> Audit
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button onClick={()=>setPage((p)=>Math.max(1,p-1))} disabled={page===1}
            className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-30 transition-all"><FiChevronLeft/></button>
          <span className="text-gray-400 text-sm">Page {page} / {totalPages}</span>
          <button onClick={()=>setPage((p)=>Math.min(totalPages,p+1))} disabled={page===totalPages}
            className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-30 transition-all"><FiChevronRight/></button>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
