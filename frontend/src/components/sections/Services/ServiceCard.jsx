import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiX, FiArrowRight } from 'react-icons/fi';

const ServiceCard = ({ service, activeService, setActiveService, cardItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Scroll lock & Global UI hide implementation
  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('overflow-hidden', 'modal-open');
    } else {
      document.body.classList.remove('overflow-hidden', 'modal-open');
    }
    return () => { document.body.classList.remove('overflow-hidden', 'modal-open'); };
  }, [isExpanded]);


  return (
    <>
      {/* ─── Main Card (Grid Item) ─────────────────────────────────────────── */}
      <motion.div
        variants={cardItem}
        className={`relative aspect-square md:aspect-auto h-full rounded-3xl overflow-hidden group cursor-pointer transition-shadow ${activeService === service.id ? 'shadow-2xl' : 'shadow-xl'
          }`}
        onMouseEnter={() => setActiveService(service.id)}
        onMouseLeave={() => setActiveService(null)}
        onClick={() => {
          if (window.innerWidth < 768) setIsExpanded(true);
        }}
      >
        {/* Card background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 z-0"></div>

        {/* Solar panel effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-4 gap-1 w-full h-full">
            {[...Array(32)].map((_, i) => (
              <div key={i} className="bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-sm"></div>
            ))}
          </div>
        </div>

        {/* Animated sun (Full size on desktop, subtle glow on mobile) */}
        {activeService === service.id && (
          <motion.div
            className="absolute -top-20 -right-20 w-60 h-60 bg-radial-gradient(circle, rgba(234,179,8,0.15) 0%, rgba(0,0,0,0) 70%) rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        <div className="relative z-10 flex flex-col h-full">
          {/* PC View: Full Info (md+) */}
          <div className="hidden md:flex flex-col h-full p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-6">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20">
                {React.cloneElement(service.icon, { size: undefined, className: "w-10 h-10" })}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{service.title}</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
              {service.features.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <div className="flex-shrink-0 mt-1 bg-green-100 dark:bg-green-900/30 w-5 h-5 rounded-full flex items-center justify-center">
                    <FiZap className="text-green-600 dark:text-green-400 w-3 h-3" />
                  </div>
                  <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm font-medium leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gray-100/50 dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/5 backdrop-blur-md">
              <div className="flex flex-wrap gap-3">
                {service.stats.map((stat, i) => (
                  <div key={i} className="px-3 py-1.5 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-full text-xs font-black uppercase tracking-widest text-yellow-700 dark:text-yellow-400 border border-yellow-500/20">
                    {stat}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile View: Bold & Centered (Icon top + Title + Info) */}
          <div className="md:hidden flex flex-col items-center justify-center text-center p-6 h-full gap-3 overflow-hidden">
            <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-xl shadow-yellow-500/20">
              {React.cloneElement(service.icon, { size: undefined, className: "w-7 h-7" })}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight uppercase tracking-wide">{service.title}</h3>
            </div>


            <div className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] flex items-center gap-1">
              DÉTAILS <FiArrowRight className="animate-pulse flex-shrink-0" />
            </div>
          </div>

        </div>
      </motion.div>

      {/* ─── Mobile Expansion Overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-xl px-4 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ y: 50, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[92%] max-h-[85vh] bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-white/10 rounded-[2.5rem] flex flex-col relative overflow-hidden cursor-default shadow-2xl"
            >
              {/* Luxury Accent (same as PC) */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-600 shadow-lg" />

              {/* Background Plate (Matching PC style) */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 z-0 opacity-50"></div>

              {/* Fixed Header in Modal */}
              <div className="relative z-10 p-6 md:p-8 pb-4 flex justify-between items-start">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg">
                    {React.cloneElement(service.icon, { size: undefined, className: "w-7 h-7" })}
                  </div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">{service.title}</h2>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-900 dark:text-white active:scale-90 transition-transform"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="relative z-10 p-6 md:p-8 pt-2 overflow-y-auto space-y-8 custom-scrollbar">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400/60 mb-3 italic">Description du service</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed font-medium">{service.description}</p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400/60 mb-5 italic">Points clés & avantages</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start bg-gray-100/50 dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/5">
                        <div className="flex-shrink-0 mt-0.5 bg-amber-500/20 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <FiZap className="text-amber-600 dark:text-amber-400 w-3 h-3" />
                        </div>
                        <span className="text-gray-900 dark:text-white text-sm font-semibold">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pb-4">
                  {service.stats.map((stat, i) => (
                    <div key={i} className="px-4 py-2 bg-amber-500/10 rounded-full text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 border border-amber-400/20">
                      {stat}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceCard;
