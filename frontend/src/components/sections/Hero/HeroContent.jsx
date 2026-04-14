import React from 'react';
import { FiArrowRight, FiCheck, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ButtonSimulateur from '../../simulator/ButtonSimulateur';
import { smoothScrollTo } from '../../../utils/scrollUtils';

const HeroContent = () => {
  return (
    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
      {/* Solar badge */}
      <motion.div
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm rounded-full mb-6 lg:mb-4 border border-yellow-400/20"
        whileHover={{ scale: 1.05 }}
      >
        <div className="mr-2 p-1 bg-yellow-500 rounded-full">
          <FiSun className="text-white w-4 h-4" />
        </div>
        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
          Solution énergétique durable
        </p>
      </motion.div>

      <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
          Énergie solaire
        </span> pour votre indépendance énergétique
      </h1>

      <p className="mt-6 lg:mt-4 text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
        Solutions photovoltaïques haut de gamme pour particuliers et entreprises. Réduisez vos factures tout en contribuant à un avenir plus vert.
      </p>

      {/* Features */}
      <div className="mt-8 lg:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          "Installation professionnelle certifiée",
          "Financement et aides de l'État",
          "Suivi de production en temps réel",
          "Maintenance et garantie incluses"
        ].map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-1 bg-green-100 dark:bg-green-900/30 w-6 h-6 rounded-full flex items-center justify-center">
              <FiCheck className="text-green-600 dark:text-green-400 w-3 h-3" />
            </div>
            <p className="ml-3 text-gray-700 dark:text-gray-300">{item}</p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-10 lg:mt-8 flex flex-col sm:flex-row gap-4">
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(234, 179, 8, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-xl transition-all flex items-center justify-center group"
          onClick={() => smoothScrollTo('contact')}
        >
          <span>Devis gratuit en 24h</span>
          <motion.span
            className="ml-2"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <FiArrowRight />
          </motion.span>
        </motion.button>

        {/* Simulateur button */}
        <ButtonSimulateur />
      </div>
    </motion.div>
  );
};

export default HeroContent;
