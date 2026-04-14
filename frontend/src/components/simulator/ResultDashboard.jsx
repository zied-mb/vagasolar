import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  FiX, FiDownload, FiCheck, FiSun, FiTrendingDown, FiShield, FiZap, FiArrowRight,
} from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PrintTemplate from './PrintTemplate';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-3.5 sm:p-5 shadow-sm backdrop-blur-md">
    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
      <div className="p-1.5 sm:p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
        {React.cloneElement(icon, { size: undefined, className: "w-4 h-4 sm:w-5 sm:h-5" })}
      </div>
      <span className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-sm font-medium uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-lg sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">{value}</div>
    {sub && <div className="text-[9px] sm:text-xs text-amber-600 dark:text-amber-500 mt-1 font-medium leading-tight">{sub}</div>}
  </div>
);

const ResultDashboard = ({ resultat, handleReset, viewAnnual, setViewAnnual, leadId }) => {
  const printTemplateRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // ── Mark PDF downloaded in the backend ────────────────────────────────────
  const markPdfDownloaded = async () => {
    if (!leadId) return;
    try {
      await fetch(`${API_URL}/api/leads/${leadId}/pdf`, { method: 'PATCH' });
    } catch {
      // Non-blocking — don't interrupt PDF generation if this fails
    }
  };

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);

    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:-9999px;z-index:-1;';
    document.body.appendChild(container);

    await new Promise((resolve) => {
      ReactDOM.render(
        <PrintTemplate ref={printTemplateRef} resultat={resultat} />,
        container, resolve
      );
    });
    await new Promise((r) => setTimeout(r, 400));

    try {
      const canvas = await html2canvas(container.firstChild, {
        scale: 2, useCORS: true, logging: false,
        backgroundColor: '#ffffff', width: 794,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      let heightLeft = pdfH, pos = 0;
      pdf.addImage(imgData, 'PNG', 0, pos, pdfW, pdfH);
      heightLeft -= pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) {
        pos -= pdf.internal.pageSize.getHeight();
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, pos, pdfW, pdfH);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      pdf.save('VagaSolar-Rapport-Solaire.pdf');
      // ✨ Track PDF download in backend
      await markPdfDownloaded();
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!resultat?.billBefore) return null;
  const { billBefore, billAfter, savings, systemSize, payback, co2 } = resultat;

  const chartData = [
    { name: 'Avant Solaire', 'Facture STEG': parseFloat((viewAnnual ? billBefore.total * 12 : billBefore.total * 3).toFixed(2)) },
    { name: 'Après Solaire', 'Facture STEG': parseFloat((viewAnnual ? billAfter.total * 12 : billAfter.total * 3).toFixed(2)) },
  ];

  const handleContactExpert = () => {
    handleReset();
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }, 300);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 w-full h-[100vh] z-[9999] bg-white dark:bg-[#050505] overflow-y-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">


          <button
            data-html2canvas-ignore onClick={handleReset}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[10005] flex items-center px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:bg-slate-800 transition shadow-lg font-medium"
          >
            <FiX className="mr-2" /> Fermer
          </button>


          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-6 gap-4 pr-32">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center">
                Rapport <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 ml-2">Solaire</span>
              </h1>
              <p className="text-slate-600 dark:text-gray-400 mt-2 text-sm sm:text-base">Audit financier et technique basé sur les tarifs STEG actuels.</p>
            </div>
            <div data-html2canvas-ignore className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleDownloadPDF} disabled={isGeneratingPDF}
                className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-white rounded-xl transition shadow-sm font-medium"
              >
                {isGeneratingPDF
                  ? <><svg className="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Génération...</>
                  : <><FiDownload className="mr-2" />Télécharger PDF</>
                }
              </button>
            </div>
          </div>


          <div className="flex bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-1 mb-8 w-fit mx-auto shadow-sm">
            {[['Trimestriel', false], ['Annuel', true]].map(([label, val]) => (
              <button key={label} onClick={() => setViewAnnual(val)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewAnnual === val ? 'bg-white dark:bg-gray-700 text-amber-600 shadow' : 'text-slate-500'}`}
              >{label}</button>
            ))}
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">


            <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4 h-fit">
              <h3 className="col-span-2 lg:col-span-1 text-xl font-bold text-slate-900 dark:text-white mb-1 lg:mb-4">Dimensionnement du Système</h3>
              <StatCard icon={<FiSun size={22} />} label="Capacité Solaire" value={`${systemSize.kWp} kWp`} sub={`${systemSize.panels} panneaux de 450W`} />
              <StatCard icon={<FiTrendingDown size={22} />} label="Économies Générées" value={`${(viewAnnual ? savings.annual : savings.trimestriel).toLocaleString(undefined, { maximumFractionDigits: 0 })} DT`} sub={`Impact sur ${viewAnnual ? '1 an' : '3 mois'}`} />
              <StatCard icon={<FiShield size={22} />} label="Indicateur ROI" value={`${payback} Ans`} sub={`Investissement: ${systemSize.cost.toLocaleString()} DT`} />
              <StatCard icon={<FiZap size={22} />} label="Impact Écologique" value={`${co2} T`} sub="De CO₂ évités par an" />
            </div>


            <div className="lg:col-span-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Comparatif Visuel</h3>
              <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-sm backdrop-blur-md flex-1">
                <div className="h-72 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e180" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} DT`} />
                      <Tooltip cursor={{ fill: '#f1f5f980' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', fontWeight: 'bold' }} itemStyle={{ color: '#d97706' }} />
                      <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="Facture STEG" fill="url(#goldGradient)" radius={[8, 8, 0, 0]} barSize={80} animationDuration={1500} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mb-3"><FiCheck size={24} /></div>
                  <h4 className="text-lg font-bold text-slate-800 dark:text-gray-200">Facture considérablement réduite</h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">Votre consommation électrique est désormais presque auto-suffisante.</p>
                </div>
              </div>
            </div>


            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Détails de Simulation</h3>
              <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-sm backdrop-blur-md">
                <div className="space-y-5">

                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Avant l'installation</p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-gray-400">Énergie & Taxes</span><span className="font-medium text-slate-900 dark:text-white">{(viewAnnual ? (billBefore.energy + billBefore.surtaxes + billBefore.tvaEnergy) * 12 : (billBefore.energy + billBefore.surtaxes + billBefore.tvaEnergy) * 3).toFixed(1)} DT</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-gray-400">Redevance Fixe</span><span className="font-medium text-slate-900 dark:text-white">{(viewAnnual ? (billBefore.fixedFee + billBefore.tvaFixed) * 12 : (billBefore.fixedFee + billBefore.tvaFixed) * 3).toFixed(1)} DT</span></div>
                      <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg"><span className="font-bold text-slate-800 dark:text-gray-300">Total Facturé</span><span className="font-bold text-slate-900 dark:text-white line-through decoration-red-500/50">{(viewAnnual ? billBefore.total * 12 : billBefore.total * 3).toFixed(1)} DT</span></div>
                    </div>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 w-full" />

                  <div>
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-wide mb-3">Aujourd'hui avec Vaga Solar</p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-gray-400">Énergie nette & Taxes</span><span className="font-medium text-slate-900 dark:text-white">{(viewAnnual ? (billAfter.energy + billAfter.surtaxes + billAfter.tvaEnergy) * 12 : (billAfter.energy + billAfter.surtaxes + billAfter.tvaEnergy) * 3).toFixed(1)} DT</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-gray-400">Frais fixes STEG</span><span className="font-medium text-slate-900 dark:text-white">{(viewAnnual ? (billAfter.fixedFee + billAfter.tvaFixed) * 12 : (billAfter.fixedFee + billAfter.tvaFixed) * 3).toFixed(1)} DT</span></div>
                      <div className="flex justify-between bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/50"><span className="font-extrabold text-lg text-slate-800 dark:text-amber-100">Nouveau Total</span><span className="text-2xl font-black text-green-600 dark:text-green-400">{(viewAnnual ? billAfter.total * 12 : billAfter.total * 3).toFixed(1)} <span className="text-sm font-semibold">DT</span></span></div>
                    </div>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={handleContactExpert}
                className="w-full mt-4 flex items-center justify-center py-4 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-gray-200 text-white dark:text-slate-900 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                Contacter un Expert pour Devis <FiArrowRight className="ml-2" />
              </motion.button>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultDashboard;
