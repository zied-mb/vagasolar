import React, { useState } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight, FiHeart, FiPlus, FiX, FiUploadCloud, FiMessageCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import TestimonialCard from './TestimonialCard';
import { useStats } from '../../../hooks/useStats';
import dataService from '../../../services/dataService';
import SkeletonCard from '../../common/SkeletonCard';
import VagaSpinner from '../../common/VagaSpinner';
import Stats from '../../common/Stats';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DEFAULT_TESTIMONIALS = [
  {
    _id: 'fallback-1',
    name: 'Ameni Ben Salem',
    role: 'Tunis / Résidentiel',
    content: 'Une installation impeccable et un suivi professionnel. Ma facture STEG a été divisée par quatre dès le premier mois. Je recommande vivement VagaSolar !',
    rating: 5,
    image: null
  },
  {
    _id: 'fallback-2',
    name: 'Khaled Mansour',
    role: 'Sousse / Industriel',
    content: 'Expertise technique impressionnante pour notre usine de textile. Le retour sur investissement est même plus rapide que prévu. Une équipe au top.',
    rating: 5,
    image: null
  },
  {
    _id: 'fallback-3',
    name: 'Sonia Dridi',
    role: 'Bizerte / Villa de luxe',
    content: 'Le design des panneaux s\'intègre parfaitement à notre architecture. Solution esthétique et ultra-performante. Merci pour votre professionnalisme.',
    rating: 5,
    image: null
  }
];

const Testimonials = () => {
  const { testimonials: rawTestimonials, loading } = useStats();
  const allTestimonials = rawTestimonials?.length > 0 ? rawTestimonials : DEFAULT_TESTIMONIALS;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);


  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', role: '', content: '', rating: 5, image: '' });

  const nextTestimonial = () => { setDirection(1); setCurrentIndex((p) => (p + 1) % allTestimonials.length); };
  const prevTestimonial = () => { setDirection(-1); setCurrentIndex((p) => (p - 1 + allTestimonials.length) % allTestimonials.length); };
  const goToTestimonial = (i) => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/api/upload/public`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setForm(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      setError('Impossible d\'uploader la photo. Veuillez réessayer.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!form.name.trim() || !form.role.trim() || !form.content.trim() || !form.rating) {
      setError('Veuillez remplir tous les champs obligatoires (Nom, Ville, Message).');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/testimonials`, {
        method: 'POST',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'envoi');

      setSuccess(true);
      dataService.clearCache(); // Force next landing page load to get fresh data
      setTimeout(() => { 
        setShowForm(false); 
        setSuccess(false); 
        setForm({ name: '', role: '', content: '', rating: 5, image: '' }); 
      }, 3000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <section id="testimonials" className="py-24 lg:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.span className="inline-flex items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-full text-sm font-semibold text-amber-700 dark:text-amber-400 border border-amber-400/30 tracking-wide shadow-lg" whileHover={{ scale: 1.05 }}>
            <FiHeart className="mr-2" /> Témoignages
          </motion.span>
          <motion.h2 className="mt-6 text-5xl lg:text-4xl font-bold text-gray-900 dark:text-white" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            Ce que disent <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600 font-black">nos clients</span>
          </motion.h2>
          <motion.p className="mt-6 text-xl lg:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            Des centaines de clients satisfaits à travers la Tunisie partagent leur expérience avec VagaSolar.
          </motion.p>


          <motion.button
            onClick={() => setShowForm(true)}
            className="mt-12 px-10 py-5 lg:px-8 lg:py-4 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 bg-[length:200%_auto] text-white font-black rounded-2xl transition-all shadow-xl shadow-yellow-500/20 flex items-center gap-3 mx-auto uppercase tracking-[0.15em] text-xs hover:bg-right"
            whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(234, 179, 8, 0.4)" }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FiPlus className="text-xl" /> Laissez un avis
          </motion.button>
        </div>

        <div className="mt-20 relative">
          {loading ? (
            <div className="max-w-5xl mx-auto">
              <SkeletonCard height="h-96" />
            </div>
          ) : allTestimonials.length > 0 ? (
            <>
              <div className="max-w-5xl lg:max-w-3xl mx-auto">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl px-5 py-6 md:p-16 lg:p-10 relative border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
                  <div className="mt-4 md:mt-12">
                    <AnimatePresence custom={direction} mode="wait">
                      <TestimonialCard
                        key={allTestimonials[currentIndex]?._id || currentIndex}
                        testimonial={allTestimonials[currentIndex]}
                        variants={variants}
                        direction={direction}
                      />
                    </AnimatePresence>
                  </div>
                </div>
              </div>


              <div className="flex justify-center mt-6 md:mt-12 space-x-6">
                <motion.button onClick={prevTestimonial} className="p-2 md:p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 text-yellow-600 dark:text-yellow-400" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FiChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
                </motion.button>
                <div className="flex items-center space-x-3">
                  {allTestimonials.map((_, i) => (
                    <motion.button key={i} onClick={() => goToTestimonial(i)}
                      className={`rounded-full transition-all ${i === currentIndex ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 w-8 h-3' : 'bg-gray-300 dark:bg-gray-600 w-3 h-3'}`}
                      whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
                <motion.button onClick={nextTestimonial} className="p-2 md:p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 text-yellow-600 dark:text-yellow-400" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FiChevronRight className="w-5 h-5 md:w-7 md:h-7" />
                </motion.button>
              </div>
            </>
          ) : (

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] p-12 text-center border border-dashed border-gray-300 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-600 dark:text-yellow-400 mx-auto mb-6">
                <FiMessageCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pas encore d'avis ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Soyez le premier à partager votre expérience avec Vaga Solar et aidez les autres à faire leur transition énergétique !
              </p>
            </motion.div>
          )}
        </div>


        {/* Global Statistics Sync */}
        <Stats className="mt-24" />
      </div>


      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] w-full max-w-xl p-6 md:p-12 shadow-2xl relative overflow-y-auto max-h-[90vh] border border-white/5"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            >
              <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10"><FiX size={24} /></button>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600" />

              {success ? (
                <div className="text-center py-10 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 rounded-full border-2 border-yellow-500 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(234,179,8,0.3)] bg-gradient-to-br from-yellow-500/10 to-transparent"
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="w-12 h-12 text-yellow-500"
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      />
                    </motion.svg>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-tight italic"
                  >
                    Merci !
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mx-auto"
                  >
                    Votre témoignage a été envoyé avec succès. Il apparaîtra sur le site après validation par notre équipe.
                  </motion.p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight uppercase italic">Donnez votre avis</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Partagez votre expérience solaire avec les futurs clients de VagaSolar.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="flex flex-col items-center gap-4 mb-10">
                      <div className="relative w-28 h-28 group">
                        {form.image ? (
                          <img src={form.image} alt="Avatar" className="w-full h-full rounded-3xl object-cover ring-4 ring-yellow-400/20 shadow-2xl transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full rounded-3xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/10 shadow-inner group-hover:border-yellow-500/30 transition-all">
                            <FiUploadCloud size={32} />
                          </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-white/60 dark:bg-black/80 rounded-3xl flex items-center justify-center backdrop-blur-sm z-10">
                            <div className="w-8 h-8 border-3 border-yellow-500 border-t-transparent animate-spin rounded-full" />
                          </div>
                        )}
                      </div>
                      <label className="inline-block px-6 py-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all cursor-pointer hover:bg-yellow-500 hover:text-black shadow-sm active:scale-95 border border-gray-200 dark:border-white/5">
                        {uploading ? 'Chargement...' : 'Ajouter une photo'}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Nom Complet</label>
                        <input
                          required placeholder="Ex: Ahmed Ben Salem"
                          value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/50 transition-all font-medium placeholder:text-gray-400/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Ville / Poste</label>
                        <input
                          placeholder="Ex: Tunis / Client Résidentiel"
                          value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/50 transition-all font-medium placeholder:text-gray-400/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Votre Message</label>
                      <textarea
                        required placeholder="Racontez votre expérience..." rows={4}
                        value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/50 resize-none transition-all font-medium leading-relaxed placeholder:text-gray-400/50"
                      />
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-[#0c0c0c] p-6 rounded-3xl border border-gray-200 dark:border-white/5">
                      <span className="text-[10px] font-black uppercase text-yellow-700 dark:text-yellow-500 tracking-[0.3em] italic">Note globale</span>
                      <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} type="button" onClick={() => setForm(p => ({ ...p, rating: star }))} className="transition-all hover:scale-125 focus:scale-110">
                            <FiStar size={32} className={`transition-colors ${star <= form.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-500 text-xs font-semibold text-center italic"
                      >
                        {error}
                      </motion.div>
                    )}

                    <button disabled={submitting || uploading} className="w-full py-5 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 italic flex items-center justify-center">
                      {submitting ? <VagaSpinner /> : 'Envoyer mon témoignage'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;