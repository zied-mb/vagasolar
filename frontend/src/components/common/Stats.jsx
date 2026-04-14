import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiZap, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import NumberTicker from './NumberTicker';
import { useStats } from '../../hooks/useStats';

const Stats = ({ className = "" }) => {
  const dynamicStats = useStats();

  const statsList = [
    {
      value: dynamicStats.totalProjects,
      label: "Projets",
      icon: <FiSun />,
      suffix: "+"
    },
    {
      value: dynamicStats.totalCapacity,
      label: "MégaWatts",
      icon: <FiZap />,
      suffix: " MWc",
      decimals: 1
    },
    {
      value: dynamicStats.averageSatisfaction,
      label: "Satisfaits",
      icon: <FiCheckCircle />,
      suffix: "%"
    },
    {
      value: dynamicStats.averageSavings,
      label: "Économies",
      icon: <FiTrendingUp />,
      suffix: "%"
    }
  ];

  return (
    <div className={`grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 ${className}`}>
      {statsList.map((stat, index) => (
        <motion.div
          key={index}
          className="bg-white/90 dark:bg-gray-800/80 rounded-xl md:rounded-2xl p-2 sm:p-4 md:p-6 backdrop-blur-md border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-2 md:gap-4">
            <div className="flex-shrink-0 w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white text-base md:text-2xl shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className="flex items-baseline justify-center md:justify-start whitespace-nowrap text-amber-500 dark:text-amber-500 font-black italic leading-none">
                <span className="text-sm sm:text-base md:text-3xl tabular-nums tracking-tighter">
                  <NumberTicker 
                    value={stat.value} 
                    decimals={stat.decimals || 0} 
                  />
                </span>
                {stat.suffix && (
                  <span className="ml-0.5 text-[10px] md:text-sm font-bold uppercase tracking-tight">
                    {stat.suffix}
                  </span>
                )}
              </p>
              <p className="mt-1 text-[8px] sm:text-[10px] md:text-[12px] text-gray-700 dark:text-gray-400 font-black uppercase tracking-[0.1em] md:tracking-[0.2em] truncate opacity-80 group-hover:opacity-100 transition-opacity">
                {stat.label}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Stats;
