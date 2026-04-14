import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiPhone, FiMail, FiArrowRight, FiShield, FiLock } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * LeadCaptureForm — The mandatory "Lead Gate"
 *
 * This component appears BETWEEN the simulator form and the ResultDashboard.
 * The user CANNOT access results without submitting their contact information.
 */
const LeadCaptureForm = ({
  resultat,
  consommationMensuelle,
  typeBatiment,
  couvertureVoulue,
  onSuccess,   // (leadId) => void — called after successful POST
  onBack,      // () => void — returns to simulator form
}) => {
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.nom.trim())       e.nom       = 'Le nom est requis.';
    if (!form.prenom.trim())    e.prenom    = 'Le prénom est requis.';
    if (!form.telephone.trim()) e.telephone = 'Le téléphone est requis.';
    else if (!/^[0-9+\s-]{7,15}$/.test(form.telephone.trim()))
      e.telephone = 'Numéro invalide.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Email invalide.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');

    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom:                  form.nom.trim(),
          prenom:               form.prenom.trim(),
          telephone:            form.telephone.trim(),
          email:                form.email.trim() || undefined,
          consommationMensuelle,
          typeBatiment,
          couvertureVoulue,
          resultat,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur serveur.');
      onSuccess(data.leadId);
    } catch (err) {
      setApiError(err.message || 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ y: 40, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      >
        {/* Gold accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 mb-4">
              <FiLock className="text-amber-500" size={24} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
              Votre audit est <span className="text-amber-500">prêt !</span>
            </h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Renseignez vos coordonnées pour accéder à votre rapport solaire personnalisé.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Nom + Prénom */}
            <div className="grid grid-cols-2 gap-3">
              {['nom', 'prenom'].map((field) => (
                <div key={field}>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      id={`lead-${field}`}
                      type="text"
                      placeholder={field === 'nom' ? 'Nom *' : 'Prénom *'}
                      value={form[field]}
                      onChange={handleChange(field)}
                      className={`w-full pl-9 pr-3 py-3 rounded-xl border text-sm outline-none transition-all ${
                        errors[field]
                          ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                          : 'border-gray-200 bg-gray-50 focus:border-amber-400 focus:ring-2 focus:ring-amber-200'
                      }`}
                    />
                  </div>
                  {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>

            {/* Téléphone */}
            <div>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  id="lead-telephone"
                  type="tel"
                  placeholder="Téléphone *"
                  value={form.telephone}
                  onChange={handleChange('telephone')}
                  className={`w-full pl-9 pr-3 py-3 rounded-xl border text-sm outline-none transition-all ${
                    errors.telephone
                      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                      : 'border-gray-200 bg-gray-50 focus:border-amber-400 focus:ring-2 focus:ring-amber-200'
                  }`}
                />
              </div>
              {errors.telephone && <p className="text-xs text-red-500 mt-1">{errors.telephone}</p>}
            </div>

            {/* Email (optional) */}
            <div>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  id="lead-email"
                  type="email"
                  placeholder="Email (optionnel)"
                  value={form.email}
                  onChange={handleChange('email')}
                  className={`w-full pl-9 pr-3 py-3 rounded-xl border text-sm outline-none transition-all ${
                    errors.email
                      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                      : 'border-gray-200 bg-gray-50 focus:border-amber-400 focus:ring-2 focus:ring-amber-200'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* API Error */}
            <AnimatePresence>
              {apiError && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-sm text-red-600 bg-red-50 rounded-xl py-2 px-3 border border-red-100"
                >
                  {apiError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 disabled:opacity-70 disabled:cursor-wait text-white font-bold rounded-xl shadow-lg shadow-amber-400/30 transition-all"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  Voir mon rapport solaire
                  <FiArrowRight size={18} />
                </>
              )}
            </motion.button>

            {/* Back link */}
            <button
              type="button"
              onClick={onBack}
              className="w-full text-center text-slate-400 hover:text-slate-600 text-sm transition-colors py-1"
            >
              ← Modifier mes données
            </button>
          </form>

          {/* Privacy note */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <FiShield size={12} />
            <span>Données confidentielles — aucun spam, promis.</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LeadCaptureForm;
