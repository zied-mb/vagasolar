import React from 'react';
import { motion } from 'framer-motion';
import NumberTicker from '../common/NumberTicker';

const StatCard = ({ stat }) => {
  // Check if value is numeric or containing a '+' to determine ticker behavior
  const isNumeric = typeof stat.value === 'number' || (!isNaN(parseFloat(stat.value)) && !stat.value.includes('/'));

  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden group"
      whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-400`} />
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-3">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300`}>
            <div className="text-xl">{stat.icon}</div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-gray-900 dark:text-white mb-1.5 italic tabular-nums">
            {isNumeric ? (
              <NumberTicker
                value={typeof stat.value === 'number' ? stat.value : parseFloat(stat.value)}
                suffix={stat.suffix || ""}
                decimals={stat.decimals || 0}
              />
            ) : (
              stat.value
            )}
          </p>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">{stat.label}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
