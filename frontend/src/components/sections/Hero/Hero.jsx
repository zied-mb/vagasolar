import React from 'react';
import { FiSun, FiBarChart2, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useStatCycle } from '../../../hooks/useStatCycle';
import { useStats } from '../../../hooks/useStats';
import HeroContent from './HeroContent';
import HeroVisual from './HeroVisual';

const Hero = () => {
  const dynamicStats = useStats();

  const stats = [
    { value: dynamicStats.averageSavings, label: "Économies d'énergie", icon: <FiBarChart2 />, suffix: "%" },
    { value: 25, label: "Garantie produit", icon: <FiShield />, suffix: " ans" },
    { value: 4.8, label: "Satisfaction client", icon: <FiSun />, suffix: "/5", decimals: 1 },
  ];

  const { currentIndex: currentStat } = useStatCycle(stats);

  return (
    <section id="home" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background & sun rays */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 z-0"></div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-1">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
              width: `${100 + i * 5}%`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          />
        ))}

        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Floating solar panels */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-gray-800 rounded-lg shadow-xl transform rotate-12 opacity-10 dark:opacity-5"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-40 left-24 w-24 h-24 bg-gray-800 rounded-lg shadow-xl transform -rotate-6 opacity-10 dark:opacity-5"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      {/* Hero content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <HeroContent />
          <HeroVisual stats={stats} currentStat={currentStat} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
