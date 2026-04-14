import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiSun, FiClock } from 'react-icons/fi';
import ProjectCard from './ProjectCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const ProjectFullGallery = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_URL}/api/projects`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.projects);
        }
      })
      .catch((err) => console.error('Error fetching projects:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`${darkMode ? 'dark bg-gray-900' : 'bg-white'} min-h-screen transition-colors duration-500`}>
      <div className="pt-16 pb-8">
        <main className="relative overflow-hidden py-24 bg-gradient-to-br from-gray-50 via-yellow-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {/* Background Decorative Elements (Synced with Home) */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-yellow-500/3 to-yellow-400/5 pointer-events-none"/>
          
          {/* Decorative center solar flare effect (Synced with Home) */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div key={i}
                className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                style={{ transform: `translate(-50%, -50%) rotate(${i * 45}deg)` }}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 5, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Top Navigation / Back Button */}
            <motion.button 
              onClick={() => navigate('/#projects')}
              className="group flex items-center gap-3 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all mb-16"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:bg-yellow-500 group-hover:border-yellow-500 group-hover:text-black transition-all">
                <FiArrowLeft size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Retour aux projets</span>
            </motion.button>

            {/* Page Header (Synced with Home patterns) */}
            <motion.div className="text-center mb-24" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
              <motion.div className="inline-flex items-center justify-center px-6 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-yellow-500/30 shadow-md" whileHover={{scale:1.03}}>
                <FiSun className="text-yellow-500 mr-2 text-lg"/>
                <span className="text-yellow-700 dark:text-yellow-400 font-medium uppercase tracking-widest text-[10px]">Archives Projets</span>
              </motion.div>
              <motion.h1 className="mt-8 text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.2}}>
                Notre Portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600 italic">Complet</span>
              </motion.h1>
              <motion.p className="mt-5 text-lg text-gray-700 dark:text-gray-400 max-w-3xl mx-auto" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.4}}>
                Découvrez l'intégralité de nos installations photovoltaïques à travers la Tunisie.
              </motion.p>
            </motion.div>

            {/* Grid Section */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
                  ))}
                </motion.div>
              ) : projects.length > 0 ? (
                <motion.div 
                  key="grid"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {projects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] p-12 text-center border border-yellow-500/20 shadow-2xl relative overflow-hidden">
                    <FiClock className="mx-auto text-yellow-500 text-5xl mb-6 opacity-30 animate-pulse" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 italic">Chargement du portfolio...</h3>
                    <p className="text-gray-600 dark:text-gray-400 uppercase tracking-widest text-[10px] font-black leading-relaxed">
                      Nos équipes mettent à jour les références en temps réel.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectFullGallery;
