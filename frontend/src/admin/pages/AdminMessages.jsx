import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiTrash2, FiTag, FiUser, FiInfo, FiCheckCircle, FiX, FiCheck, FiMinus } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | message object
  const [filter] = useState('All'); // 'All' | 'Contact' | 'Devis'
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchMessages = () => {
    setLoading(true);
    fetch(`${API_URL}/api/messages`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setMessages(d.messages); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const openMessage = async (msg) => {
    setModal(msg);
    if (msg.status === 'New') {
      try {
        await fetch(`${API_URL}/api/messages/${msg._id}/read`, {
          method: 'PATCH',
          credentials: 'include'
        });
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, status: 'Read' } : m));
      } catch (err) {
        console.error('Mark read failed', err);
      }
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Supprimer ce message définitivement ?')) return;
    try {
      await fetch(`${API_URL}/api/messages/${id}`, { method: 'DELETE', credentials: 'include' });
      setMessages(prev => prev.filter(m => m._id !== id));
      setSelectedIds(prev => prev.filter(sid => sid !== id));
      if (modal && modal._id === id) setModal(null);
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  // ─── Bulk Actions Logic ───────────────────────────────────────────────────
  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const filtered = messages.filter(m => filter === 'All' || m.type === filter);
  
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(m => m._id));
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Voulez-vous vraiment supprimer ces ${selectedIds.length} messages ?`)) return;
    setBulkLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/messages/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
        credentials: 'include'
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => !selectedIds.includes(m._id)));
        setSelectedIds([]);
      }
    } catch (err) {
      console.error('Bulk delete failed', err);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkRead = async () => {
    setBulkLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/messages/bulk-read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
        credentials: 'include'
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => selectedIds.includes(m._id) ? { ...m, status: 'Read' } : m));
        setSelectedIds([]);
      }
    } catch (err) {
      console.error('Bulk read failed', err);
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Messagerie Unified</h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">Centralisation des demandes de contact et devis</p>
        </div>
        
        {filtered.length > 0 && (
          <button 
            onClick={toggleSelectAll}
            className="flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all w-full md:w-auto"
          >
            {selectedIds.length === filtered.length ? <FiMinus /> : <FiCheck />}
            {selectedIds.length === filtered.length ? 'Tout désélectionner' : 'Tout sélectionner'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 relative">
          {filtered.length === 0 ? (
            <div className="bg-gray-900/50 border border-dashed border-white/5 rounded-3xl p-12 text-center text-gray-500">
              <FiMail size={40} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">Aucun message trouvé</p>
            </div>
          ) : (
            filtered.map((m) => {
              const isSelected = selectedIds.includes(m._id);
              return (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => openMessage(m)}
                  className={`group relative flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 md:p-5 bg-gray-900 border rounded-2xl cursor-pointer transition-all hover:bg-gray-800/80 ${isSelected ? 'border-amber-400/60 ring-1 ring-amber-400/30' : m.status === 'New' ? 'border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.05)]' : 'border-white/5 opacity-80'}`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Custom Checkbox */}
                    <div 
                      onClick={(e) => toggleSelect(m._id, e)}
                      className={`w-6 h-6 md:w-5 md:h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-amber-400 border-amber-400 text-black' : 'border-white/20 bg-white/5 group-hover:border-amber-400/50'}`}
                    >
                      {isSelected && <FiCheck size={12} strokeWidth={4} />}
                    </div>

                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg ${m.type === 'Devis' ? 'bg-amber-400/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {m.type === 'Devis' ? <FiTag /> : <FiUser />}
                    </div>

                    {/* Mobile Date - Top Right */}
                    <div className="md:hidden flex-1 text-right">
                       <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tight">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 md:mt-0 mt-1">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm md:text-base truncate">{m.name}</span>
                        {m.status === 'New' && <span className="px-2 py-0.5 bg-amber-400 text-black text-[9px] font-black rounded-full uppercase scale-90">Nouveau</span>}
                      </div>
                      <span className="hidden md:block text-[10px] text-gray-600 font-bold uppercase tracking-tighter whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleDateString()} · {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500 mt-1 truncate">
                      <span className="flex items-center gap-1 truncate"><FiMail size={10} className="shrink-0" /> {m.email}</span>
                      {m.phone && <span className="flex items-center gap-1 shrink-0">• {m.phone}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity mt-2 md:mt-0 border-t md:border-t-0 border-white/5 pt-2 md:pt-0">
                    <button onClick={(e) => { e.stopPropagation(); deleteMessage(m._id); }} className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all flex items-center gap-2 md:block">
                      <FiTrash2 size={16} />
                      <span className="md:hidden text-[10px] font-bold uppercase">Supprimer</span>
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-[100] w-[92%] sm:w-full sm:max-w-lg"
          >
            <div className="bg-gray-900/95 backdrop-blur-2xl border border-amber-400/40 rounded-2xl p-3 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3 overflow-hidden relative">
              {/* Luxury Progress Glow */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-amber-400 w-full animate-pulse" />
              
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black text-xs md:text-sm shadow-lg shadow-amber-400/20">
                  {selectedIds.length}
                </div>
                <div className="hidden xs:block">
                  <p className="text-white text-[11px] md:text-sm font-bold leading-tight">Actions</p>
                  <p className="text-gray-400 text-[8px] md:text-[10px] uppercase font-black tracking-widest leading-none">Sélection</p>
                </div>
              </div>

              <div className="flex gap-1.5 md:gap-2">
                <button 
                  disabled={bulkLoading}
                  onClick={handleBulkRead}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  <FiCheckCircle size={14} /> <span className="hidden sm:inline">Marquer lu</span>
                </button>
                <button 
                  disabled={bulkLoading}
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  <FiTrash2 size={14} /> <span className="hidden sm:inline">Supprimer</span>
                </button>
                <button 
                  onClick={() => setSelectedIds([])}
                  className="p-2 bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal Preview */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-gray-900 border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl ${selectedIds.includes(modal._id) ? 'border-amber-400' : ''}`}
              initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, opacity: 0 }}
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-white/5 bg-gray-900/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-lg md:text-xl ${modal.type === 'Devis' ? 'bg-amber-400 text-black' : 'bg-gray-800 text-white'}`}>
                    {modal.type === 'Devis' ? <FiInfo /> : <FiUser />}
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter">{modal.type} Request</h2>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1">ID: {modal._id.slice(-6)}</p>
                  </div>
                </div>
                <button onClick={() => setModal(null)} className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-full transition-all"><FiX size={24} className="w-5 h-5 md:w-6 md:h-6" /></button>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 md:px-8 py-4 md:py-6 bg-white/5 overflow-y-auto max-h-[30vh] sm:max-h-none">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-1">Expéditeur</label>
                    <p className="text-white font-bold text-sm md:text-base">{modal.name}</p>
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-1">Email</label>
                    <p className="text-amber-400 font-bold text-sm md:text-base underline underline-offset-4 decoration-amber-400/20 truncate">{modal.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-1">Téléphone</label>
                    <p className="text-white font-bold text-sm md:text-base">{modal.phone || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-1">Date d'envoi</label>
                    <p className="text-gray-400 font-bold text-[10px] md:text-xs">{new Date(modal.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <label className="text-[9px] text-amber-500/50 font-black uppercase tracking-[0.3em] block mb-4">Contenu du message</label>
                <div className="bg-gray-800/40 border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 text-gray-200 leading-relaxed text-xs md:text-sm italic shadow-inner">
                  "{modal.content}"
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 md:p-8 border-t border-white/5 bg-gray-900/50 flex gap-3 md:gap-4">
                <button onClick={() => deleteMessage(modal._id)} className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-xl transition-all">
                  <FiTrash2 /> <span className="hidden xs:inline">Supprimer</span>
                </button>
                <button onClick={() => setModal(null)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20">
                  <FiCheckCircle /> Fermer / Lu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;
