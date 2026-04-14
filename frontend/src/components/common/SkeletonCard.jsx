import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = ({ height = "h-72", className = "" }) => {
  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] bg-neutral-800 border border-neutral-700/50 shadow-2xl flex-shrink-0 ${height} ${className}`}>
      {/* Shimmer Animation */}
      <motion.div
        className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent z-0"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 2,
          ease: "linear"
        }}
      />
      
      {/* Top Gold Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-30 z-10" />

      {/* Minimal luxury skeleton layout */}
      <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col gap-4">
        <div className="w-1/3 h-3 bg-neutral-700/50 rounded-full" />
        <div className="w-3/4 h-5 bg-neutral-700/50 rounded-full" />
        <div className="w-1/2 h-3 bg-neutral-700/50 rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonCard;
