import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiX, FiStar, FiUploadCloud, FiCheck, FiShield, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EMPTY = { 
  name: '', 
  role: '', 
  content: '', 
  rating: 5, 
  image: '', 
  active: true, 
  isApproved: false, // Default for new admin-created too, can toggle
  order: 0 
};

// ─── Confirm Delete Modal ─────────────────────────────────────────────────
const ConfirmDeleteModal = ({ onConfirm, onCancel, loading }) => (
  <motion.div
    className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
    <motion.div
      className="relative w-full max-w-sm bg-gray-900/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
      initial={{ y: 60, opacity: 0, scale: 0.96 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 60, opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500" />
      <div className="p-7 space-y-5">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
          <FiTrash2 size={24} className="text-red-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-white font-black text-lg tracking-tight">Supprimer ce témoignage ?</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            L'image sera également <span className="text-red-400 font-semibold">effacée de Cloudinary</span>. Cette action est irréversible.
          </p>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-bold text-sm tracking-wide border border-white/5 transition-all disabled:opacity-50"
          >
            Annuler
          </button>
          <motion.button
            onClick={onConfirm}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm tracking-wide shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><FiTrash2 size={14} /> Confirmer</>
            }
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Success Toast ──────────────────────────────────────────────────────────
const Toast = ({ message }) => (
  <motion.div
    className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-4 bg-gray-900/95 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-md max-w-xs"
    initial={{ opacity: 0, y: 24, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
      <FiCheckCircle size={16} className="text-emerald-400" />
    </div>
    <p className="text-white text-sm font-semibold">{message}</p>
  </motion.div>
);

const AdminTestimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Delete confirmation state
  const [confirmTarget, setConfirmTarget] = useState(null); // testimonial id to delete
  const [deleting, setDeleting]           = useState(false);

  // Success toast state
  const [toast, setToast] = useState(''); // '' = hidden

  const fetch_ = () => {
    setLoading(true);
    fetch(`${API_URL}/api/testimonials/all`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setItems(d.testimonials); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch_(); }, []);

  const openCreate = () => { setForm(EMPTY); setModal('create'); setError(''); };
  const openEdit = (t) => { setForm({ ...t }); setModal(t._id); setError(''); };
  const closeModal = () => { setModal(null); setError(''); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Échec upload');
      setForm(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true); setError('');
    const isEdit = modal !== 'create';
    const url = isEdit ? `${API_URL}/api/testimonials/${modal}` : `${API_URL}/api/testimonials`;
    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      closeModal(); fetch_();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    setConfirmTarget(id);
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      const res  = await fetch(`${API_URL}/api/testimonials/${confirmTarget}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Échec suppression');

      setConfirmTarget(null);
      fetch_();

      setToast('Témoignage supprimé avec succès !');
      setTimeout(() => setToast(''), 3500);
    } catch (err) {
      setConfirmTarget(null);
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const toggleApproval = async (t) => {
    await fetch(`${API_URL}/api/testimonials/${t._id}`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...t, isApproved: !t.isApproved }),
    });
    fetch_();
  };

  const toggleActive = async (t) => {
    await fetch(`${API_URL}/api/testimonials/${t._id}`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...t, active: !t.active }),
    });
    fetch_();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Témoignages</h1>
          <p className="text-gray-400 mt-1">{items.length} retours d'expérience clients</p>
        </div>
        <button 
          onClick={openCreate} 
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black uppercase text-xs tracking-widest rounded-xl shadow-lg transition-all hover:scale-[1.02]"
        >
          <FiPlus size={16} /> Ajouter Manuel
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
           <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((t) => (
            <motion.div 
              key={t._id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gray-900 border rounded-3xl p-6 transition-all ${t.isApproved ? 'border-white/8' : 'border-amber-400/30 bg-amber-400/[0.02]'} ${!t.active && 'opacity-60 grayscale'}`}
            >
              <div className="flex items-start gap-5">
                <div className="relative shrink-0">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center text-gray-600 border border-white/5"><FiUploadCloud /></div>
                  )}
                  {!t.isApproved && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-black border-2 border-gray-900 shadow-lg" title="En attente d'approbation">
                       <FiShield size={10} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="font-black text-white text-base truncate">{t.name}</h3>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{t.role || 'Client Vaga Solar'}</p>
                    </div>
                    <div className="flex items-center gap-0.5 bg-gray-800/50 px-2 py-1 rounded-lg border border-white/5">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} size={11} className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm italic leading-relaxed line-clamp-3">"{t.content}"</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6">
                <button 
                  onClick={() => toggleApproval(t)} 
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t.isApproved ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-amber-400 text-black hover:bg-amber-500 shadow-lg shadow-amber-400/10'}`}
                >
                  {t.isApproved ? <><FiCheck /> Approuvé</> : <><FiShield /> Approuver</>}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(t)} className="p-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-white/5 transition-all"><FiEdit2 size={16} /></button>
                  <button onClick={() => toggleActive(t)} className="p-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-white/5 transition-all">{t.active ? <FiEyeOff size={16} /> : <FiEye size={16} />}</button>
                  <button onClick={() => handleDelete(t._id)} className="p-2.5 bg-gray-800 hover:bg-red-500/20 text-red-400 rounded-xl border border-white/5 transition-all"><FiTrash2 size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Editor */}
      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-900 border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl" initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, opacity: 0 }}>
              <div className="p-8 pb-4 flex items-center justify-between">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">{modal === 'create' ? 'NOUVEL AVIS' : 'Éditer l\'avis'}</h2>
                <button onClick={closeModal} className="p-2 text-gray-500 hover:text-white transition-colors"><FiX size={24} /></button>
              </div>

              <div className="p-8 pt-4 space-y-6">
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold">{error}</div>}
                
                {/* Photo Upload */}
                <div className="flex items-center gap-6">
                   <div className="relative w-20 h-20 group">
                      {form.image ? (
                        <img src={form.image} alt="Avatar" className="w-full h-full rounded-3xl object-cover ring-2 ring-amber-400/30" />
                      ) : (
                        <div className="w-full h-full rounded-3xl bg-gray-800 flex items-center justify-center text-gray-600 border border-dashed border-white/10"><FiUploadCloud size={24} /></div>
                      )}
                      {uploading && <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center"><div className="w-5 h-5 border-2 border-amber-400 border-t-transparent animate-spin rounded-full"/></div>}
                   </div>
                   <div className="flex-1">
                      <label className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-2 block">Photo de l'auteur</label>
                      <label className="inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border border-white/5">
                         {uploading ? 'Upload en cours...' : 'Sélectionner un fichier'}
                         <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-2 block">Nom Complet</label>
                    <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-5 py-3.5 bg-gray-800/50 border border-white/5 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400/50" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-2 block">Rôle / Poste</label>
                    <input value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))} className="w-full px-5 py-3.5 bg-gray-800/50 border border-white/5 rounded-2xl text-white text-sm focus:outline-none" placeholder="Ex: Chef d'entreprise" />
                  </div>
                </div>

                <div>
                   <label className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-2 block">Commentaire Client</label>
                   <textarea rows={4} value={form.content} onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))} className="w-full px-5 py-3.5 bg-gray-800/50 border border-white/5 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400/50 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-6 bg-gray-800/30 p-5 rounded-3xl border border-white/5">
                   <div>
                      <label className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-3 block text-center">Note Étoiles</label>
                      <div className="flex justify-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setForm(p => ({ ...p, rating: star }))}>
                            <FiStar size={18} className={star <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'} />
                          </button>
                        ))}
                      </div>
                   </div>
                   <div className="flex flex-col justify-center">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-10 h-5 rounded-full transition-colors ${form.isApproved ? 'bg-amber-400' : 'bg-gray-700'}`} onClick={() => setForm(p => ({ ...p, isApproved: !p.isApproved }))}>
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${form.isApproved ? 'translate-x-5' : ''}`} />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase group-hover:text-white transition-colors">Approuvé</span>
                      </label>
                   </div>
                </div>

                <button onClick={handleSave} disabled={saving || uploading} className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black uppercase text-sm tracking-widest rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50">
                   {saving ? 'Enregistrement...' : 'Sauvegarder le témoignage'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Delete Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {confirmTarget && (
          <ConfirmDeleteModal
            onConfirm={confirmDelete}
            onCancel={() => setConfirmTarget(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>

      {/* ── Success Toast ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && <Toast message={toast} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminTestimonials;
