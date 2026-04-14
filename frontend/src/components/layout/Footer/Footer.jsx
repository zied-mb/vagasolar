import React from 'react';
import { FiFacebook, FiLinkedin, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import VagaSpinner from '../../common/VagaSpinner';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/subscribers`, {
        method: 'POST',
        credentials: 'omit', // STRICTLY PUBLIC - don't send any token cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Merci pour votre inscription !' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Une erreur est survenue.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setLoading(false);
      // Auto-clear message after 5s
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };
  
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Logo + About */}
          <div>
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Vaga Solar Logo" 
                className="w-12 h-12 object-contain" 
              />
              <span className="ml-3 text-xl font-bold text-white">
                Vaga<span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">Solar</span>
              </span>
            </div>
            <p className="mt-6 text-gray-400">
              Solutions solaires innovantes pour un avenir énergétique durable en Tunisie.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://www.facebook.com/Vaga.Solar.Tunisie/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/vaga-solar/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <FiLinkedin size={20} />
              </a>
              <a
                href="https://x.com/intent/post?url=https%3A%2F%2Fvagasolar.tn%2F"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <FiTwitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Liens rapides</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-yellow-500 transition-colors">Accueil</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-yellow-500 transition-colors">Services</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-yellow-500 transition-colors">À propos</a></li>
              <li><a href="#projects" className="text-gray-400 hover:text-yellow-500 transition-colors">Projets</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-yellow-500 transition-colors">Témoignages</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-yellow-500 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Nos services */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Nos services</h3>
            <ul className="space-y-3">
              <li><span className="text-gray-400 hover:text-yellow-500 cursor-pointer">Installation Résidentielle</span></li>
              <li><span className="text-gray-400 hover:text-yellow-500 cursor-pointer">Solutions Industrielles</span></li>
              <li><span className="text-gray-400 hover:text-yellow-500 cursor-pointer">Systèmes de Stockage</span></li>
              <li><span className="text-gray-400 hover:text-yellow-500 cursor-pointer">Maintenance & Support</span></li>
              <li><span className="text-gray-400 hover:text-yellow-500 cursor-pointer">Audit Énergétique</span></li>
              <li><span className="text-gray-400 hover:text-yellow-500 cursor-pointer">Financement Solaire</span></li>
            </ul>
          </div>
          
          {/* Contact + Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex">
                <FiMapPin className="w-5 h-5 text-yellow-500 mt-1 mr-3" />
                <span className="text-gray-400">Tunis, Tunisie</span>
              </li>
              <li className="flex">
                <FiPhone className="w-5 h-5 text-yellow-500 mt-1 mr-3" />
                <span className="text-gray-400">+216 40 018 523</span>
              </li>
              <li className="flex">
                <FiMail className="w-5 h-5 text-yellow-500 mt-1 mr-3" />
                <span className="text-gray-400">contact@vagasolar.tn</span>
              </li>
            </ul>
            
            <div className="mt-8 relative h-32">
              <h4 className="text-lg font-bold text-white mb-4">Newsletter</h4>
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex bg-gray-800 rounded-xl overflow-hidden shadow-inner">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email" 
                    required
                    className="px-4 py-3 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full disabled:opacity-50"
                    disabled={loading || message.type === 'success'}
                  />
                  <div className="relative min-w-[120px] flex items-center justify-center bg-gray-800">
                    <AnimatePresence mode="wait">
                      {message.type === 'success' ? (
                        <motion.div
                          key="success"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-full h-full bg-green-500/10 flex items-center justify-center border-l border-green-500/20 text-green-500"
                        >
                          <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <motion.path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </motion.svg>
                        </motion.div>
                      ) : (
                        <motion.button 
                          key="button"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          type="submit"
                          disabled={loading}
                          className="w-full h-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center text-black font-bold uppercase text-[10px] tracking-widest"
                        >
                          {loading ? <VagaSpinner size="w-4 h-4" className="border-black/20 border-t-black" /> : "S'inscrire"}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                {message.text && message.type !== 'success' && (
                  <p className="mt-2 text-sm text-red-500 animate-pulse">
                    {message.text}
                  </p>
                )}
                {message.text && message.type === 'success' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-yellow-500 font-bold italic">
                    {message.text}
                  </motion.p>
                )}
              </form>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} VagaSolar. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;