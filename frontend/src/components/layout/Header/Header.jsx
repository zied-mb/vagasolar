import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../../../constants/navigation';
import { useScrollSection } from '../../../hooks/useScrollSection';

const Header = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { scrolled, activeSection, handleSmoothScroll: scrollToSection } = useScrollSection();

  const handleSmoothScroll = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      scrollToSection(id);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && headerRef.current && !headerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  const solarGradient = "bg-gradient-to-r from-amber-400 via-yellow-500 to-yellow-400";
  const solarGradientHover = "hover:from-amber-500 hover:via-yellow-600 hover:to-yellow-500";

  return (
    <header
      ref={headerRef}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md py-2'
        : 'bg-transparent py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <motion.div
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => handleSmoothScroll('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src="/logo.png"
              alt="Vaga Solar Logo"
              className="w-16 h-16 object-contain"
            />
            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
              Vaga <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-500">Solar</span>
            </span>
          </motion.div>

          <nav className="hidden md:flex space-x-1">
            {NAV_ITEMS.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleSmoothScroll(item.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${activeSection === item.id
                  ? `${solarGradient} text-white shadow-lg`
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Aller à ${item.name}`}
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-full ${darkMode ? 'bg-yellow-400/20' : 'bg-gray-200'} transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={darkMode ? "Mode clair" : "Mode sombre"}
            >
              {darkMode ? (
                <FiSun size={20} className="text-yellow-400" />
              ) : (
                <FiMoon size={20} className="text-gray-700" />
              )}
            </motion.button>

            {/* Solar-themed CTA Button */}
            <motion.a
              href="/#contact"
              className="hidden md:inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-full text-white shadow-lg transition-all"
              onClick={() => setIsOpen(false)}
              initial={{ background: "linear-gradient(135deg, #f59e0b, #eab308)" }}
              whileHover={{
                scale: 1.05,
                background: "linear-gradient(135deg, #fbbf24, #eab308)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Devis Gratuit
            </motion.a>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Fermer menu" : "Ouvrir menu"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Animated Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 w-screen h-screen z-[60] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg pt-20 overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-200/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300"
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              aria-label="Fermer le menu"
            >
              <FiX size={22} />
            </button>

            {/* Menu content wrapper - stop propagation so clicks inside do not close */}
            <div className="px-6 py-4 space-y-4" onClick={(e) => e.stopPropagation()}>
              {NAV_ITEMS.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleSmoothScroll(item.id)}
                  className={`block w-full text-left px-5 py-3 rounded-xl text-lg font-medium transition-colors ${activeSection === item.id
                    ? `${solarGradient} text-white shadow-md`
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.name}
                </motion.button>
              ))}
              <div className="pt-4">
                <motion.a
                  href="/#contact"
                  className={`w-full flex justify-center items-center px-5 py-3.5 text-lg font-medium rounded-full text-white shadow-lg ${solarGradient} ${solarGradientHover} transition-all`}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Devis Gratuit
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
