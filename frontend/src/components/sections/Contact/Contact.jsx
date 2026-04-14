import React from 'react';
import { FiMail, FiSun, FiSend, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useContactForm } from '../../../hooks/useContactForm';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';

const Contact = () => {
  const { formData, handleChange, handleSubmit, loading, status } = useContactForm();

  return (
    <section id="contact" className="py-12 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Enhanced Solar background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-amber-400/15 via-yellow-500/10 to-transparent transform -skew-y-2 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-amber-400/8 to-transparent rounded-full transform translate-x-1/4 translate-y-1/4"></div>
      <div className="absolute top-1/3 right-0 w-48 h-48 bg-gradient-to-l from-yellow-400/5 to-transparent rounded-full transform translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.span
            className="inline-flex items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-full text-sm font-semibold text-amber-700 dark:text-amber-400 border border-amber-400/30 tracking-wide shadow-lg"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(245, 158, 11, 0.1)" }}
          >
            <FiMail className="mr-2" />
            Contactez-nous
          </motion.span>
          <motion.h2
            className="mt-6 text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Discutons de votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">projet solaire</span>
          </motion.h2>
          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions et vous accompagner dans votre transition énergétique.
          </motion.p>
        </div>

        <div className="mt-10 md:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Contact information */}
          <ContactInfo />

          {/* Contact form */}
          <ContactForm 
            formData={formData} 
            handleChange={handleChange} 
            handleSubmit={handleSubmit} 
            loading={loading}
            status={status}
          />
        </div>

        {/* Additional info section */}
        <motion.div
          className="mt-10 md:mt-20 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-3xl p-6 md:p-10 border border-amber-100/50 dark:border-amber-900/30 relative overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>
          <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 bg-gradient-to-r from-yellow-500/10 to-amber-400/10 rounded-full"></div>
          
          <div className="flex flex-row md:grid md:grid-cols-3 gap-2 md:gap-10 items-start justify-around">
            <motion.div 
              className="text-center group flex-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-2 md:mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <FiClock size={20} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-[10px] md:text-2xl font-bold text-gray-900 dark:text-white mb-0 md:mb-3 leading-tight">Réponse rapide</h3>
              <p className="hidden md:block text-gray-600 dark:text-gray-400 text-lg">Nous répondons à toutes les demandes dans un délai de 24 heures</p>
            </motion.div>

            <motion.div 
              className="text-center group flex-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-2 md:mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <FiSun size={20} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-[10px] md:text-2xl font-bold text-gray-900 dark:text-white mb-0 md:mb-3 leading-tight">Devis gratuit</h3>
              <p className="hidden md:block text-gray-600 dark:text-gray-400 text-lg">Évaluation sans engagement de votre projet solaire</p>
            </motion.div>

            <motion.div 
              className="text-center group flex-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-2 md:mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <FiSend size={20} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-[10px] md:text-2xl font-bold text-gray-900 dark:text-white mb-0 md:mb-3 leading-tight">Accompagnement</h3>
              <p className="hidden md:block text-gray-600 dark:text-gray-400 text-lg">Suivi personnalisé tout au long de votre projet</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;