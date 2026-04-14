import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiHome } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#d4af3715_0%,_transparent_70%)]"/>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"/>
      
      <motion.div 
        className="relative z-10 text-center max-w-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div 
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 mb-8 shadow-2xl shadow-amber-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <FiSun className="text-black" size={48}/>
        </motion.div>

        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-6">Page introuvable</h2>
        <p className="text-gray-400 mb-10 leading-relaxed">
          La ressource que vous cherchez a été déplacée ou n'existe plus. Reprenons notre chemin vers l'énergie solaire.
        </p>

        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all w-full justify-center"
        >
          <FiHome size={20} />
          Retour à l'accueil
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
