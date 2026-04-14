import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiMapPin, FiZap, FiTrendingUp, FiSettings,
  FiSun
} from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProjectDetail = ({ darkMode, setDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [error, setError] = useState(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/projects/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProject(data.project);
        setSimilar(data.similar || []);
        setActiveImg(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const isRTL = (text) => {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    return arabicPattern.test(text);
  };

  const renderFormattedDescription = (text) => {
    if (!text) return null;
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.map((para, pIdx) => {
      const lines = para.split('\n');
      const isList = lines.some(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
      if (isList) {
        return (
          <ul key={pIdx} className="space-y-4 mb-4 md:mb-8 last:mb-0">
            {lines.map((line, lIdx) => {
              const cleanedLine = line.trim().replace(/^[-*]\s*/, '');
              if (!cleanedLine) return null;
              return (
                <li key={lIdx} className="flex items-start gap-4 group/li">
                  <div className="flex-shrink-0 mt-1.5 w-5 h-5 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-500 border border-yellow-400/20 group-hover/li:bg-yellow-500 group-hover/li:text-black transition-all duration-300">
                    <FiZap size={10} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed group-hover/li:text-gray-900 dark:group-hover/li:text-white transition-colors">
                    {cleanedLine}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      }
      return (
        <p key={pIdx} className="mb-4 md:mb-8 last:mb-0 text-gray-700 dark:text-gray-300 leading-relaxed md:leading-[1.8] text-[13px] md:text-lg font-medium">
          {para}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 text-center text-white">
        <p className="text-red-400 font-bold mb-4">{error || "Projet introuvable"}</p>
        <button onClick={() => navigate('/#projects')} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl">Retour aux projets</button>
      </div>
    );
  }

  const images = project.images || [];

  return (
    <div className={`${darkMode ? 'dark bg-gray-900' : 'bg-white'} min-h-screen transition-colors duration-500`}>
      <div className="pt-16 pb-8">
        <main className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-yellow-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {/* Background Decorative Elements (Synced with Home) */}
          <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-br from-yellow-400/10 via-yellow-500/5 to-yellow-400/10 pointer-events-none" />

          {/* Decorative solar flares */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div key={i}
                className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                style={{ transform: `translate(-50%, -50%) rotate(${i * 60}deg)` }}
                animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 6, repeat: Infinity, delay: i * 0.8 }}
              />
            ))}
          </div>

          <section className="max-w-7xl mx-auto px-6 py-6 md:py-12 relative z-10">
            <motion.button
              onClick={() => navigate('/#projects')}
              className="group flex items-center gap-3 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all mb-6 md:mb-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:bg-yellow-500 group-hover:border-yellow-500 group-hover:text-black transition-all">
                <FiArrowLeft size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Retour aux projets</span>
            </motion.button>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-12 mb-10 md:mb-20">
              <motion.div
                className="space-y-4 md:space-y-6 flex-grow"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-yellow-500/30 shadow-md">
                  <FiSun className="text-yellow-500 text-sm" />
                  <span className="text-yellow-700 dark:text-yellow-400 font-medium uppercase tracking-widest text-[10px]">Reference • {project.type}</span>
                </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-snug lg:leading-none uppercase tracking-tighter italic whitespace-normal lg:whitespace-nowrap overflow-visible w-full block py-2">
                  {project.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-bold tracking-[0.2em] uppercase">
                  <FiMapPin className="text-yellow-500" /> {project.location}
                </div>
              </motion.div>

              <motion.div
                className="hidden lg:flex flex-col items-end gap-2 border-l-2 border-yellow-500/20 pl-8 h-fit"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Capacité Installée</p>
                <div className="flex items-center gap-3 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600 italic">
                  <FiZap className="text-yellow-500" /> {project.capacity}
                </div>
              </motion.div>
            </div>

            {/* ── Visual Media ── */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 md:mb-24 items-start">
              <div className="lg:col-span-2 order-2 lg:order-1 flex lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 h-fit lg:max-h-[600px] no-scrollbar py-2 px-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`flex-shrink-0 w-20 lg:w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImg === idx ? 'border-yellow-500 scale-95 shadow-xl shadow-yellow-500/10' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`}
                  >
                    <img src={img.url} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="lg:col-span-7 lg:order-2 order-1">
                <motion.div
                  key={activeImg}
                  className="aspect-video lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-white/5 shadow-2xl relative"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <img src={images[activeImg]?.url} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between">
                    <div className="flex gap-2">
                      {images.map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full transition-all ${activeImg === idx ? 'w-8 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'w-2 bg-white/20'}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Technical grid sync with Home styles */}
              <div className="lg:col-span-3 order-3 space-y-3 md:space-y-6"> {/* Na9asna f-el space-y */}
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-yellow-500/20 rounded-[2rem] p-4 md:p-8 shadow-xl shadow-black/5">
                  {/* Title mلموم khir */}
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 md:mb-8 border-b border-white/5 pb-2 italic">
                    Fiche Technique
                  </h3>

                  {/* Grid m-riguél: gap sghir bech may-dhaya3ch blassa */}
                  <div className="grid grid-cols-2 gap-2 md:gap-4 lg:flex lg:flex-col lg:space-y-6">
                    {[
                      { label: 'Puissance', value: project.capacity, icon: <FiZap /> },
                      { label: 'Économies', value: project.savings, icon: <FiTrendingUp /> },
                      { label: 'Secteur', value: project.type, icon: <FiSettings /> },
                      { label: 'Ville', value: project.location, icon: <FiMapPin /> }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 group bg-white/5 lg:bg-transparent p-2 lg:p-0 rounded-xl border border-white/5 lg:border-none">
                        {/* Icon Size Fixed w-10/h-10 on Mobile */}
                        <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                          {item.icon}
                        </div>
                        <div className="min-w-0"> {/* added min-w-0 bech el truncate yekhdem */}
                          <p className="text-[8px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0">{item.label}</p>
                          <p className="text-xs lg:text-xl font-bold italic text-gray-900 dark:text-white truncate">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Installation Active Section mلمومة 3al ekher */}
                <div className="p-4 bg-white/30 dark:bg-gray-900/40 rounded-[1.5rem] border border-white/5">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
                      Installation Active
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Story Section ── */}
            <section className="py-10 md:py-24 border-t border-yellow-500/10">
              <div className="flex flex-col lg:flex-row gap-10 md:gap-20 items-start">
                <div className="lg:w-1/3 space-y-4 md:space-y-8 lg:sticky lg:top-32 self-start h-fit mb-8 md:mb-12 lg:mb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-[2px] w-12 bg-yellow-500" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-500 italic">Impact Solaire</h2>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold italic uppercase tracking-tighter leading-tight text-gray-900 dark:text-white">
                    L'histoire de ce <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Succès</span>
                  </h3>
                </div>

                <motion.div
                  className={`lg:w-2/3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-yellow-500/20 rounded-[3.5rem] p-4 md:p-16 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-yellow-500/40 ${isRTL(project.description) ? 'text-right' : 'text-left'}`}
                  style={{ direction: isRTL(project.description) ? 'rtl' : 'ltr' }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {/* Decorative gradients */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
                  <div className="relative z-10 selection:bg-yellow-500/20">
                    <div className={`transition-all duration-500 overflow-hidden ${!isDescExpanded ? 'line-clamp-4 md:line-clamp-none max-h-[140px] md:max-h-none' : 'max-h-[2000px]'}`}>
                      {renderFormattedDescription(project.description)}
                    </div>

                    <button
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                      className="md:hidden mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500 hover:text-yellow-600 transition-colors"
                    >
                      {isDescExpanded ? 'Voir Moins' : 'Lire la suite'}
                      <motion.div
                        animate={{ rotate: isDescExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FiSettings className="rotate-90" size={12} />
                      </motion.div>
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ── Related Section ── */}
            {similar.length > 0 && (
              <section className="py-12 md:py-24">
                <div className="flex flex-col md:flex-row items-end justify-between gap-4 md:gap-12 mb-6 md:mb-16">
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter italic dark:text-white">Projets Similaires</h2>
                    <div className="h-1 w-16 md:h-1.5 md:w-24 bg-gradient-to-r from-yellow-500 to-transparent rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-8">
                  {similar.slice(0, 3).map((s, idx) => (
                    <Link to={`/projects/${s._id}`} key={idx} className="group relative overflow-hidden rounded-2xl md:rounded-[2.5rem] aspect-square bg-gray-900 border-2 border-white/5">
                      <img src={s.images?.[0]?.url} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 md:p-8 flex flex-col justify-end">
                        <p className="text-[7px] md:text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-0.5 md:mb-2">{s.location}</p>
                        <h4 className="text-[10px] md:text-xl font-bold text-white uppercase italic leading-tight line-clamp-2">{s.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Navigation CTAs */}
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => navigate('/gallery')}
                    className="flex-1 px-4 py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-yellow-500/20 hover:scale-105 transition-all text-center"
                  >
                    All Projects
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 px-4 py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-yellow-500/20 hover:scale-105 transition-all text-center"
                  >
                    Home Page
                  </button>
                </div>
              </section>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
