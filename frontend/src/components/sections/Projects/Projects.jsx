import { useNavigate } from 'react-router-dom';
import { FiSun, FiClock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import SkeletonCard from '../../common/SkeletonCard';
import { useStats } from '../../../hooks/useStats';
import Stats from '../../common/Stats';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };

const Projects = () => {
  const navigate = useNavigate();
  const { projects: allProjects, loading, totalProjects } = useStats();


  return (
    <section id="projects" className="scroll-mt-24 py-24 bg-gradient-to-br from-gray-50 via-yellow-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-yellow-500/3 to-yellow-400/5" />

      {/* Decorative center solar flare effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] opacity-10">
        {[...Array(8)].map((_, i) => (
          <motion.div key={i}
            className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
            style={{ transform: `translate(-50%, -50%) rotate(${i * 45}deg)` }}
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }}>
          <motion.div className="inline-flex items-center justify-center px-6 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-yellow-500/30 shadow-md" whileHover={{ scale: 1.03 }}>
            <FiSun className="text-yellow-500 mr-2 text-lg" />
            <span className="text-yellow-700 dark:text-yellow-400 font-black uppercase tracking-[0.2em] text-[10px]">
              {totalProjects} Réalisations actives
            </span>
          </motion.div>
          <motion.h2 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
            Projets <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Réalisés</span>
          </motion.h2>
          <motion.p className="mt-5 text-lg text-gray-700 dark:text-gray-400 max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}>
            Découvrez nos dernières installations solaires à travers la Tunisie.
          </motion.p>
        </motion.div>

        {/* Projects Content */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} height="h-80" />)}
          </div>
        ) : allProjects.length > 0 ? (
          <motion.div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}>
            {allProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </motion.div>
        ) : (
          /* Professional Empty State - Coming Soon */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] p-12 text-center border border-yellow-500/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-yellow-400/20 transition-all duration-700" />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center text-white text-3xl mb-8 shadow-lg shadow-yellow-500/20 animate-pulse">
                  <FiClock />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 italic">Installations en cours...</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed text-lg">
                  Nos équipes sont actuellement sur le terrain pour finaliser de nouvelles installations à travers la Tunisie. Revenez bientôt pour découvrir nos derniers succès !
                </p>
              </div>
              <div className="mt-10 flex gap-4 justify-center">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-yellow-600 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        {allProjects.length > 0 && (
          <motion.div className="mt-16 text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7, delay: 0.5 }}>
            <motion.button
              onClick={() => navigate('/gallery')}
              className="px-10 py-5 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-600 text-white font-black rounded-2xl shadow-xl shadow-yellow-500/20 flex items-center mx-auto group uppercase tracking-[0.2em] text-[10px] border border-white/10"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(234, 179, 8, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              Voir tous nos projets
              <FiArrowRight className="ml-3 text-lg group-hover:translate-x-2 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        )}

        {/* Global Statistics Sync */}
        <Stats className="mt-20" />
      </div>
    </section>
  );
};

export default Projects;