import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LuxuryNotification (Elite Minimalist Pill)
 * - PC: Top-Right (Compact 280px)
 * - Mobile: Top-Center (Compact)
 * - Structure: No header, centered vertical alignment, 0.5px border.
 */
const Notification = ({ show, message, onDismiss }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed top-24 right-0 sm:right-6 left-0 sm:left-auto z-[9999] flex justify-center sm:justify-end px-4 pointer-events-none">
          <motion.div
            initial={{ y: -15, opacity: 0, scale: 0.98 }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              scale: 1,
              transition: { type: 'spring', damping: 25, stiffness: 250 }
            }}
            exit={{ 
              y: -10, 
              opacity: 0, 
              scale: 0.99, 
              transition: { duration: 0.15 } 
            }}
            className="w-full max-w-[280px] pointer-events-auto"
          >
            {/* Minimalist Pill Card */}
            <motion.div 
              animate={{ opacity: [0.95, 1, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative bg-[#050505]/90 backdrop-blur-[12px] border-[0.5px] border-amber-400/30 rounded-2xl px-4 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="flex items-center gap-3 relative z-10">
                {/* Ultra-Compact Gold Icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-yellow-600/5 flex items-center justify-center border-[0.5px] border-amber-400/30">
                  <motion.svg 
                    viewBox="0 0 24 24" 
                    className="w-4 h-4 text-amber-500"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path 
                      d="M20 6L9 17L4 12" 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </motion.svg>
                </div>

                {/* Vertically Centered Elite Text */}
                <div className="flex-1 min-w-0 flex items-center">
                  <p className="text-gray-100 font-bold text-[12px] leading-tight tracking-tight">
                    {message}
                  </p>
                </div>

                {/* Minimalist Close X */}
                <button 
                  onClick={onDismiss}
                  className="p-1 h-fit text-gray-700 hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Seamless progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[1.2px] bg-white/5">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4.5, ease: "linear" }}
                  onAnimationComplete={onDismiss}
                  className="h-full bg-amber-500/40"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
