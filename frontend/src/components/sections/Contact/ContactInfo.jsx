import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiMail, FiPhone, FiClock, FiFacebook, FiLinkedin, FiTwitter } from 'react-icons/fi';

const ContactInfo = () => {
  return (
    <motion.div
      className="lg:col-span-1"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-4 md:p-8 h-full border border-amber-100/50 dark:border-amber-900/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>
        <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full"></div>

        <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-8">Nos coordonnées</h3>

        <div className="space-y-4 md:space-y-8">
          <motion.div
            className="flex items-start group"
            whileHover={{ x: 8 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <FiMapPin size={18} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white">Adresse</h4>
              <p className="mt-1 text-gray-600 dark:text-gray-400 font-medium text-xs md:text-base">
                Tunis, Tunisie
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start group"
            whileHover={{ x: 8 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <FiMail size={18} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white">Email</h4>
              <p className="mt-1 text-gray-600 dark:text-gray-400 font-medium text-xs md:text-base">
                contact@vagasolar.tn
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start group"
            whileHover={{ x: 8 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <FiPhone size={18} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white">Téléphone</h4>
              <p className="mt-1 text-gray-600 dark:text-gray-400 font-medium text-xs md:text-base">
                +216 40 018 523
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start group"
            whileHover={{ x: 8 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <FiClock size={18} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white">Horaires</h4>
              <p className="mt-1 text-gray-600 dark:text-gray-400 font-medium text-xs md:text-base">
                Lun-Ven: 8h-18h<br />
                Sam: 8h-13h
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 pt-4 md:mt-10 md:pt-8 border-t border-amber-100 dark:border-amber-900/30">
          <h4 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white mb-6">Suivez-nous</h4>
          <div className="flex space-x-2 md:space-x-4">
            <motion.a
              href="https://www.facebook.com/Vaga.Solar.Tunisie/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-lg"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(245, 158, 11, 0.3)', boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <FiFacebook />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/company/vaga-solar/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-lg"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(245, 158, 11, 0.3)', boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLinkedin />
            </motion.a>
            <motion.a
              href="https://x.com/intent/post?url=https%3A%2F%2Fvagasolar.tn%2F"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-lg"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(245, 158, 11, 0.3)', boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <FiTwitter />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
