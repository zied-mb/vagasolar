import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      className="bg-white dark:bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-white/10 group hover:border-yellow-500/30 transition-all transform hover:-translate-y-1"
      whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(234, 179, 8, 0.15)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex flex-col items-center md:flex-row md:items-start text-center md:text-left">
        <div className="bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg mb-4 md:mb-0 shrink-0">
          {feature.icon}
        </div>
        <div className="md:ml-5">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors tracking-wide">{feature.title}</h3>
          <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300 px-2 md:px-0">{feature.description}</p>
        </div>
      </div>

    </motion.div>
  );
};

export default FeatureCard;
