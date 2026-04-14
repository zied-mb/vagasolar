import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiLoader, FiCheck } from 'react-icons/fi';

const ContactForm = ({ formData, handleChange, handleSubmit, loading, status }) => {
  const [btnState, setBtnState] = useState('idle'); // 'idle' | 'loading' | 'success'

  useEffect(() => {
    if (status === 'loading') setBtnState('loading');
    else if (status === 'success') {
      setBtnState('success');
      const timer = setTimeout(() => setBtnState('idle'), 2000);
      return () => clearTimeout(timer);
    } else {
      setBtnState('idle');
    }
  }, [status]);

  return (
    <motion.div
      className="lg:col-span-2 relative"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-12 h-full border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden group">
        {/* Luxury Gold Border Glow */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/20"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl group-hover:bg-amber-400/10 transition-all duration-1000"></div>

        <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 md:mb-4 tracking-tight">Parlons de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600 font-extrabold">votre projet</span></h3>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-1.5 md:space-y-2">
              <label htmlFor="name" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2 italic">Nom complet</label>
              <input
                type="text" id="name" name="name" value={formData.name} onChange={handleChange} required disabled={loading}
                className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/5 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-gray-900 dark:text-white transition-all shadow-inner disabled:opacity-50 font-medium text-sm md:text-base"
                placeholder="Ex: Zied Ben Salem"
              />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label htmlFor="email" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2 italic">Email direct</label>
              <input
                type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={loading}
                className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/5 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-gray-900 dark:text-white transition-all shadow-inner disabled:opacity-50 font-medium text-sm md:text-base"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label htmlFor="phone" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2 italic">Téléphone</label>
            <input
              type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={loading}
              className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/5 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-gray-900 dark:text-white transition-all shadow-inner disabled:opacity-50 font-medium text-sm md:text-base"
              placeholder="+216 XX XXX XXX"
            />
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label htmlFor="message" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2 italic">Détails de votre projet</label>
            <textarea
              id="message" name="message" value={formData.message} onChange={handleChange} required disabled={loading} rows="4"
              className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/5 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-gray-900 dark:text-white transition-all shadow-inner resize-none disabled:opacity-50 font-medium text-sm md:text-base"
              placeholder="Besoin énergétique, localisation, questions spécifiques..."
            ></textarea>
          </div>

          <motion.button
            type="submit" disabled={loading || btnState === 'success'}
            className={`w-full flex justify-center items-center gap-3 px-6 py-4 md:px-8 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[8px] min-[380px]:text-[9px] md:text-[10px] transition-all shadow-2xl overflow-hidden relative italic group/btn ${btnState === 'success'
              ? 'bg-green-500 text-white shadow-green-500/20'
              : 'bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-500 bg-[length:200%_auto] text-white shadow-amber-500/20 hover:bg-right'
              } disabled:opacity-50`}
            whileHover={!loading && btnState !== 'success' ? { scale: 1.02 } : {}}
            whileTap={!loading && btnState !== 'success' ? { scale: 0.98 } : {}}
          >
            {btnState === 'loading' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                <FiLoader className="animate-spin text-xl" />
                <span className="animate-pulse">Transmission...</span>
              </motion.div>
            ) : btnState === 'success' ? (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-3">
                <FiCheck className="text-xl" />
                <span>Message Reçu</span>
              </motion.div>
            ) : (
              <>
                <span>Envoyer le message</span>
                <FiSend className="text-base group-hover/btn:translate-x-2 group-hover/btn:-translate-y-1 transition-transform" />
              </>
            )}

            {btnState !== 'success' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              />
            )}
          </motion.button>
        </form>

      </div>
    </motion.div>
  );
};

export default ContactForm;
