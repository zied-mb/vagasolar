import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiX, FiSave, FiUploadCloud, FiImage, FiAward, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EMPTY = { 
  title: '', 
  type: 'residential', 
  description: '', 
  capacity: '', 
  savings: '', 
  location: '', 
  images: [], 
  active: true
};

const TYPES = ['residential', 'commercial', 'agricultural', 'industrial'];

// ─── Confirm Delete Modal ────────────────────────────────────────────────────
const ConfirmDeleteModal = ({ onConfirm, onCancel, loading }) => (
  <motion.div
    className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Backdrop */}
    <motion.div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    />

    {/* Panel */}
    <motion.div
      className="relative w-full max-w-sm bg-gray-900/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
      initial={{ y: 60, opacity: 0, scale: 0.96 }}
      animate={{ y: 0,  opacity: 1, scale: 1 }}
      exit={{ y: 60, opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      {/* Red top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500" />

      <div className="p-7 space-y-5">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
          <FiTrash2 size={24} className="text-red-400" />
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h3 className="text-white font-black text-lg tracking-tight">Supprimer ce projet ?</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Toutes les images seront <span className="text-red-400 font-semibold">effacées de Cloudinary</span>. Cette action est irréversible.
          </p>
        </div>

        {/* Actions */}
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
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><FiTrash2 size={14} /> Confirmer</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Success Toast ────────────────────────────────────────────────────────────
const Toast = ({ message }) => (
  <motion.div
    className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-4 bg-gray-900/95 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-md max-w-xs"
    initial={{ opacity: 0, y: 24, scale: 0.95 }}
    animate={{ opacity: 1, y: 0,  scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
      <FiCheckCircle size={16} className="text-emerald-400" />
    </div>
    <p className="text-white text-sm font-semibold">{message}</p>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | project._id
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Delete confirmation state
  const [confirmTarget, setConfirmTarget] = useState(null); // project id to delete
  const [deleting, setDeleting]           = useState(false);

  // Success toast state
  const [toast, setToast] = useState(''); // message string, '' = hidden

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    
    // 1. Cache Busting: Add timestamp + 'no-store' to force fresh data
    const url = `${API_URL}/api/projects/all?t=${Date.now()}`;
    
    // 2. Auth: Check for JWT in localStorage (Developer often stores it as 'token')
    const token = localStorage.getItem('token');
    const headers = {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(url, { 
        credentials: 'include',
        headers,
        cache: 'no-store' 
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error(`[FETCH_ERROR] Status: ${res.status}`, data);
        if (res.status === 401 || res.status === 403) {
          setError("Session expirée ou non autorisée. Veuillez vous reconnecter.");
        } else {
          setError(data.message || "Erreur lors de la récupération des projets.");
        }
        return;
      }

      if (data.success) {
        setProjects(data.projects);
      }
    } catch (e) {
      console.error("[CONN_ERROR]", e);
      setError("Échec de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => { setForm(EMPTY); setModal('create'); setError(''); };
  const openEdit = (p) => { 
    const sanitizedImages = p.images && p.images.length > 0 ? p.images : (p.image ? [{ url: p.image, public_id: 'legacy' }] : []);
    setForm({ ...p, images: sanitizedImages }); 
    setModal(p._id); 
    setError(''); 
  };
  const closeModal = () => { setModal(null); setError(''); };

  const handleMultipleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    // Verbose logging for debugging the "Server error"

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file); // Matches upload.array('images')
    });

    try {
      const res = await fetch(`${API_URL}/api/upload/multiple`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('[UPLOAD_FAILED]', data);
        throw new Error(data.error || data.message || 'Le serveur a rejeté les images.');
      }


      setForm(prev => ({ 
        ...prev, 
        images: [...(prev.images || []), ...data.files] 
      }));
    } catch (err) {
      console.error('[TRANSIT_ERROR]', err);
      setError(`Erreur upload: ${err.message}`);
    } finally {
      setUploading(false);
      // Reset input value to allow re-uploading the same file if needed
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!form.images || form.images.length === 0) {
      setError('Au moins une image est requise.');
      return;
    }

    setSaving(true);
    setError('');
    const isEdit = modal !== 'create';
    const url = isEdit ? `${API_URL}/api/projects/${modal}` : `${API_URL}/api/projects`;

    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      closeModal();
      fetchProjects();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    // Open the custom confirmation modal instead of window.confirm()
    setConfirmTarget(id);
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      const res  = await fetch(`${API_URL}/api/projects/${confirmTarget}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setConfirmTarget(null);
      fetchProjects();

      // Show success toast, auto-dismiss after 3.5 s
      setToast('Projet supprimé avec succès !');
      setTimeout(() => setToast(''), 3500);
    } catch (err) {
      setConfirmTarget(null);
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (p) => {
    await fetch(`${API_URL}/api/projects/${p._id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, active: !p.active }),
    });
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter">Gestion du Portfolio</h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">{projects.length} références actives</p>
        </div>
        <button 
          onClick={openCreate} 
          className="group flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FiPlus size={16} /> Nouveau Projet
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((p) => (
            <motion.div 
              key={p._id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className={`bg-gray-900 border rounded-3xl overflow-hidden group transition-all ${p.active ? 'border-white/8 shadow-2xl' : 'border-white/4 opacity-60'}`}
            >
              <div className="h-48 bg-gray-800 overflow-hidden relative">
                {p.images && p.images.length > 0 ? (
                  <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 bg-gray-900/50">
                    <FiUploadCloud size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {p.images?.length > 1 && (
                   <span className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] text-white flex items-center gap-1 font-bold">
                      <FiImage size={10} /> {p.images.length}
                   </span>
                )}

                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${p.active ? 'bg-amber-400 text-black' : 'bg-gray-700 text-gray-300'}`}>
                  {p.active ? 'Public' : 'Brouillon'}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-black text-white text-lg leading-tight truncate uppercase tracking-tighter">{p.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-amber-500 font-black uppercase tracking-widest">
                   <span>{p.location}</span>
                   <span className="w-1 h-1 bg-amber-500/30 rounded-full"/>
                   <span>{p.capacity}</span>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                    <FiEdit2 size={13} /> Gérer
                  </button>
                  <button onClick={() => toggleActive(p)} className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all border border-white/5">
                    {p.active ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="p-3 bg-gray-800 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-white/5">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Editor */}
      <AnimatePresence>
        {modal && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl" 
              initial={{ y: 50, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between px-8 py-8 border-b border-white/5 bg-gray-900/50">
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">{modal === 'create' ? 'Nouveau Projet' : 'Configuration Galerie'}</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Multi-upload Cloudinary actié</p>
                </div>
                <button onClick={closeModal} className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
                  <FiX size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {error && <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3 animate-pulse"><FiAlertTriangle className="flex-shrink-0" /> {error}</div>}
                
                {/* GALLERY AREA */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                     <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Galerie Photos ({form.images?.length || 0}/10)</label>
                     <label className="cursor-pointer flex items-center gap-2 text-[10px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest transition-colors">
                        <FiPlus /> Ajouter des visuels
                        <input type="file" multiple className="hidden" accept="image/*" onChange={handleMultipleUpload} disabled={uploading} />
                     </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {form.images?.length < 10 && (
                      <label className={`aspect-square rounded-3xl border-2 border-dashed border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex flex-col items-center justify-center cursor-pointer group ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                         {uploading ? (
                           <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                         ) : (
                           <>
                              <FiUploadCloud size={24} className="text-gray-600 group-hover:text-amber-400 group-hover:scale-110 transition-all" />
                              <span className="text-[8px] font-black text-gray-600 group-hover:text-amber-400 mt-3 tracking-widest">DRAG & DROP</span>
                           </>
                         )}
                         <input type="file" multiple className="hidden" accept="image/*" onChange={handleMultipleUpload} disabled={uploading || form.images?.length >= 10} />
                      </label>
                    )}

                    {form.images?.map((img, idx) => (
                      <motion.div key={idx} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="aspect-square rounded-3xl bg-gray-800 relative group overflow-hidden border border-white/5">
                         <img src={img.url} alt="Project" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button onClick={() => removeImage(idx)} className="p-3 bg-red-500 text-white rounded-2xl hover:scale-110 transition-transform shadow-xl">
                               <FiTrash2 size={16} />
                            </button>
                         </div>
                         {idx === 0 && (
                           <div className="absolute top-3 left-3 px-2 py-1 bg-amber-400 text-[8px] font-black text-black rounded-lg shadow-lg uppercase flex items-center gap-1 tracking-widest">
                             <FiAward size={10} /> Principal
                           </div>
                         )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                   <div className="space-y-6">
                      {[
                        ['Titre de la réalisation', 'title', 'text', 'Installation Solaire...'],
                        ['Localisation', 'location', 'text', 'Tunis, La Marsa...'],
                        ['Capacité (kWp)', 'capacity', 'text', '5.2 kWp...'],
                        ['Économies (%)', 'savings', 'text', '80%...'],
                      ].map(([label, key, type, placeholder]) => (
                        <div key={key} className="space-y-2">
                          <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">{label}</label>
                          <input 
                            type={type} value={form[key]} placeholder={placeholder}
                            onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                            className="w-full px-6 py-4 bg-gray-800/40 border border-white/5 rounded-2xl text-white text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400/50 transition-all placeholder:text-gray-700"
                          />
                        </div>
                      ))}
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Secteur</label>
                        <select 
                          value={form.type} 
                          onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))} 
                          className="w-full px-6 py-4 bg-gray-800/40 border border-white/5 rounded-2xl text-white text-sm font-black focus:border-amber-400/50 transition-all"
                        >
                          {TYPES.map(t => <option key={t} value={t} className="bg-gray-900 capitalize font-bold">{t}</option>)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Détails Techniques</label>
                        <textarea 
                          rows={6} value={form.description} 
                          onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                          placeholder="Spécifications de l'installation..."
                          className="w-full px-6 py-4 bg-gray-800/40 border border-white/5 rounded-2xl text-white text-sm font-medium focus:border-amber-400/50 resize-none transition-all placeholder:text-gray-700 leading-relaxed"
                        />
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-gray-900/50 flex gap-4">
                <button onClick={closeModal} className="px-8 py-4 bg-gray-800 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-gray-700 transition-all border border-white/5">
                  Fermer
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saving || uploading} 
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSave size={16} /> 
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Delete Modal ─────────────────────────────────────── */}
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

export default AdminProjects;
