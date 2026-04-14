import React from 'react';
import { FiCheck, FiUsers, FiAward, FiShield, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ABOUT_FEATURES } from '../../../constants/about';
import { smoothScrollTo } from '../../../utils/scrollUtils';
import AboutVisual from './AboutVisual';
import FeatureCard from './FeatureCard';
import Stats from '../../common/Stats';

const About = () => {
  const features = ABOUT_FEATURES.map((f, i) => ({
    ...f,
    icon: [<FiCheck size={24} />, <FiUsers size={24} />, <FiAward size={24} />, <FiShield size={24} />][i],
  }));

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 transform -skew-y-6 -translate-y-24"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-r from-yellow-400/5 to-yellow-500/5 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-yellow-400/5 to-yellow-500/5 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400/30 rounded-full dark:bg-yellow-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header section */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-white/5 backdrop-blur-xl rounded-full text-sm font-semibold text-yellow-700 dark:text-yellow-400 border border-yellow-400/20 tracking-wide"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(234, 179, 8, 0.1)" }}
          >
            <FiSun className="mr-2" />
            NOTRE EXPERTISE
          </motion.span>

          <h1 className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
            Leaders <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Photovoltaïques</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0">
            VagaSolar transforme l'énergie solaire en solutions concrètes depuis 2008. Notre expertise technique et notre engagement durable font de nous le partenaire idéal pour votre transition énergétique.
          </p>
        </motion.div>

        {/* Main layout split into tiers for perfect alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left column - Visual (Centered ONLY with Features) */}
          <AboutVisual />

          {/* Right column - Features */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Lower Tier - Partner and Buttons (Follows naturally below the features) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-8">
          <div className="hidden lg:block"></div> {/* Spacer on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          >
            {/* Partner section */}
            <motion.div
              className="bg-yellow-100 dark:bg-yellow-500/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-200 dark:border-yellow-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src="/Partenaire.jpg"
                      alt="Zied Meddeb"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-yellow-500 shadow-sm">
                    <FiSun className="text-yellow-600 w-3 h-3" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-5">
                  <p className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">ZIED MEDDEB</p>
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm sm:text-base">Partenaire Officiel</p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-2 italic leading-snug">
                    "Accompagner nos clients vers une transition énergétique durable"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(250,204,21,0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => smoothScrollTo('projects')}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium shadow-md transition-all text-sm sm:text-base"
              >
                NOS RÉALISATIONS
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Global Statistics Sync */}
        <Stats className="mt-12 sm:mt-16" />

        {/* Bottom CTA Section */}
        <motion.div
          className="mt-8 sm:mt-12 lg:mt-14 bg-gradient-to-r from-yellow-100 to-yellow-100 dark:from-yellow-500/10 dark:to-yellow-600/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 border border-yellow-200 dark:border-yellow-500/20 overflow-hidden relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-r from-yellow-400/5 to-yellow-500/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-4 sm:px-0">
              Prêt à passer à l'énergie solaire?
            </h3>
            <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
              Rejoignez les centaines de clients satisfaits et commencez à économiser sur vos factures d'électricité dès aujourd'hui.
            </p>
            <div className="mt-6 sm:mt-8 lg:mt-10 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(234, 179, 8, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => smoothScrollTo('contact')}
                className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all tracking-wide text-sm sm:text-base"
              >
                DEMANDER UN DEVIS GRATUIT
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>


    </section>
  );
};

export default About;