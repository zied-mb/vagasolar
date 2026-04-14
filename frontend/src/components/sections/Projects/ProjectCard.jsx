import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiExternalLink, FiZap, FiMapPin, FiTrendingUp, FiImage } from 'react-icons/fi';

const cardItem = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  // Use 'images' array from newer DB structure, or fallback to 'image' for older data
  const coverUrl = project.images && project.images.length > 0
    ? project.images[0].url
    : project.image;

  return (
    <motion.div
      variants={cardItem}
      className="group relative bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg overflow-hidden border border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full flex flex-col"
      whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)' }}
    >
      {/* Image Container */}
      <div
        className="aspect-video bg-gray-100 dark:bg-gray-900 relative overflow-hidden cursor-pointer"
        onClick={() => navigate(`/projects/${project._id}`)}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 group-hover:scale-110"
          style={{ backgroundImage: `url(${coverUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-2">
          <motion.div className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white text-[7px] md:text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-lg md:rounded-xl shadow-lg backdrop-blur-md flex items-center gap-1 border border-white/20" whileHover={{ scale: 1.05 }}>
            <FiMapPin className="text-yellow-500" />{project.location}
          </motion.div>
        </div>

        {/* Project Metrics Floating */}
        <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 flex justify-between items-end">
          <div className="flex flex-col gap-0.5 md:gap-1 text-white">
            <span className="text-[6px] md:text-[8px] font-black uppercase tracking-[0.2em] opacity-80">Capacité</span>
            <span className="text-[10px] md:text-xs font-bold flex items-center gap-1 md:gap-1.5"><FiZap className="text-yellow-400" /> {project.capacity}</span>
          </div>

          {project.images?.length > 1 && (
            <div className="flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-black/40 backdrop-blur-md rounded-lg md:rounded-xl text-[8px] md:text-[10px] text-white font-black uppercase tracking-widest border border-white/10">
              <FiImage /> +{project.images.length - 1}
            </div>
          )}
        </div>

        {/* View Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl">
            <FiExternalLink className="text-white w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 md:p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-1.5 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/10 rounded-md md:rounded-lg border border-yellow-500/20">
            {project.type}
          </span>
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
            <FiTrendingUp /> {project.savings}
          </div>
        </div>

        <h3 className="mt-2 md:mt-5 text-sm md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300 leading-tight line-clamp-2">
          {project.title}
        </h3>

        <p className="hidden md:line-clamp-3 mt-4 text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
          {project.description}
        </p>

        <div className="mt-auto pt-3 md:pt-6 flex justify-center">
          <motion.button
            onClick={() => navigate(`/projects/${project._id}`)}
            className="w-full py-1.5 md:py-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-yellow-500 hover:text-black text-gray-900 dark:text-white font-black uppercase tracking-widest text-[8px] md:text-[10px] rounded-lg md:rounded-2xl transition-all border border-gray-200 dark:border-white/5 flex items-center justify-center gap-1 md:gap-2 group/btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explorer
            <FiExternalLink className="group-hover/btn:translate-x-1 transition-transform" size={10} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
