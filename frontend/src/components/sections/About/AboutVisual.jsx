import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiTrendingUp, FiZap } from 'react-icons/fi';

const AboutVisual = () => {
  return (
    <motion.div 
      className="relative lg:scale-90 lg:origin-center"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      {/* Glass morphism container */}
      <div className="bg-white dark:bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
        {/* Solar panel grid with 3D effect */}
        <div className="grid grid-cols-3 sm:grid-cols-4 grid-rows-3 gap-2 sm:gap-3 lg:gap-4 perspective-1000">
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i} 
              className="bg-gradient-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-300 dark:border-gray-700/50 flex items-center justify-center relative overflow-hidden group transform transition-all duration-500 hover:scale-105 hover:shadow-lg"
              whileHover={{ y: -5, rotateX: 5, rotateY: 5 }}
            >
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-yellow-500 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          ))}
        </div>
        
        {/* Animated sun */}
        <motion.div 
          className="absolute top-1/3 left-1/3 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg shadow-yellow-400/20 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FiSun className="text-white text-4xl" />
        </motion.div>
        
        {/* Experience badge */}
        <motion.div 
          className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-5 w-48 sm:w-56 lg:w-64 border border-yellow-400/30 backdrop-blur-md"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        >
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <FiTrendingUp className="text-white w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold">15+ ANS</p>
              <p className="text-yellow-100 text-xs sm:text-sm">D'EXPERTISE SOLAIRE</p>
            </div>
          </div>
        </motion.div>
        
        {/* Stats badge */}
        <motion.div 
          className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-white dark:bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 w-48 sm:w-56 lg:w-60 border border-gray-200 dark:border-white/10"
          initial={{ opacity: 0, y: 20, rotate: 5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center mb-2">
            <div className="bg-yellow-100 dark:bg-yellow-500/20 p-2 rounded-lg">
              <FiZap className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="ml-3 text-gray-600 dark:text-gray-300 text-sm">INSTALLATIONS RÉALISÉES</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">850+</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutVisual;
