import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiX } from 'react-icons/fi';
import { useSimulator } from '../../hooks/useSimulator';
import SimulatorForm    from './SimulatorForm';
import LeadCaptureForm  from './LeadCaptureForm';
import ResultDashboard  from './ResultDashboard';

const Portal = ({ children }) => ReactDOM.createPortal(children, document.body);

/**
 * ButtonSimulateur — Orchestrates the full 3-step flow:
 *
 *   CLOSED → [open]
 *   OPEN + flowStep='form'      → SimulatorForm  (3-step wizard)
 *   OPEN + flowStep='lead'      → LeadCaptureForm (mandatory gate)
 *   OPEN + flowStep='dashboard' → ResultDashboard (full-screen audit)
 */
const ButtonSimulateur = () => {
  const [open, setOpen] = React.useState(false);

  const {
    typeBatiment, setTypeBatiment,
    consommation, setConsommation,
    couverture,   setCouverture,
    viewAnnual,   setViewAnnual,
    currentStep,
    resultat,
    flowStep, setFlowStep,
    leadId,   setLeadId,
    handleSubmit,
    handleReset,
    nextStep,
    prevStep,
  } = useSimulator();

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow  = 'hidden';
      document.body.style.position  = 'fixed';
      document.body.style.width     = '100%';
    } else {
      document.body.style.overflow  = '';
      document.body.style.position  = '';
      document.body.style.width     = '';
    }
    return () => {
      document.body.style.overflow  = '';
      document.body.style.position  = '';
      document.body.style.width     = '';
    };
  }, [open]);

  const handleClose = () => {
    handleReset();
    setOpen(false);
  };

  // Called by LeadCaptureForm on successful POST /api/leads
  const handleLeadSuccess = (newLeadId) => {
    setLeadId(newLeadId);
    setFlowStep('dashboard');
  };

  // Called by LeadCaptureForm "← Modifier mes données"
  const handleLeadBack = () => {
    setFlowStep('form');
  };

  return (
    <>
      {/* ── Trigger Button ─────────────────────────────────────────────── */}
      <motion.button
        id="btn-simulateur"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-xl border border-gray-200 flex items-center shadow-sm"
        onClick={() => setOpen(true)}
      >
        <FiZap className="mr-2 text-yellow-500" />
        Simuler mes économies
      </motion.button>

      {/* ── Portal — escapes all stacking contexts ─────────────────────── */}
      <Portal>
        <AnimatePresence>

          {/* STEP 1 — Simulator Form */}
          {open && flowStep === 'form' && (
            <motion.div
              key="form-overlay"
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9998] px-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto"
                initial={{ y: -30, opacity: 0, scale: 0.97 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                  aria-label="Fermer"
                >
                  <FiX size={18} />
                </button>
                <div className="p-6">
                  <SimulatorForm
                    typeBatiment={typeBatiment}   setTypeBatiment={setTypeBatiment}
                    consommation={consommation}    setConsommation={setConsommation}
                    couverture={couverture}        setCouverture={setCouverture}
                    currentStep={currentStep}
                    handleSubmit={handleSubmit}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2 — Lead Capture Gate */}
          {open && flowStep === 'lead' && (
            <LeadCaptureForm
              key="lead-gate"
              resultat={resultat}
              consommationMensuelle={parseFloat(consommation)}
              typeBatiment={typeBatiment}
              couvertureVoulue={couverture}
              onSuccess={handleLeadSuccess}
              onBack={handleLeadBack}
            />
          )}

          {/* STEP 3 — Full-Screen Result Dashboard */}
          {open && flowStep === 'dashboard' && (
            <ResultDashboard
              key="dashboard"
              viewAnnual={viewAnnual}
              setViewAnnual={setViewAnnual}
              resultat={resultat}
              handleReset={handleClose}
              leadId={leadId}
            />
          )}

        </AnimatePresence>
      </Portal>
    </>
  );
};

export default ButtonSimulateur;
