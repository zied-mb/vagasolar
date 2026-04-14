import React from 'react';
import { motion } from 'framer-motion';

const SectionBadge = ({ icon, text, colorClass = "from-yellow-500/10 to-yellow-600/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20", hoverBg = "rgba(234, 179, 8, 0.1)" }) => {
  return (
    <motion.span 
      className={`inline-flex items-center px-6 py-2.5 bg-gradient-to-r ${colorClass} backdrop-blur-sm rounded-full border tracking-wide font-medium shadow-md`}
      whileHover={{ scale: 1.05, backgroundColor: hoverBg }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </motion.span>
  );
};

export default SectionBadge;
