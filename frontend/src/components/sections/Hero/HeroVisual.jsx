import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import NumberTicker from '../../common/NumberTicker';

const HeroVisual = ({ stats, currentStat }) => {
  return (
    <motion.div className="relative lg:scale-90 lg:origin-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
      {/* Solar panel grid */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden transform rotate-3">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1.5 p-3">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-yellow-600/5"></div>
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-500 rounded-full opacity-80"></div>
            </motion.div>
          ))}
        </div>

        {/* Sun graphic */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg shadow-yellow-400/30"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 30px rgba(234, 179, 8, 0.3)",
              "0 0 50px rgba(234, 179, 8, 0.5)",
              "0 0 30px rgba(234, 179, 8, 0.3)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Stats panel - Perfectly Balanced Overlap */}
        <motion.div
          className="absolute -bottom-2 -right-2 md:-bottom-6 md:-right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 md:p-6 w-[205px] md:w-72 border border-gray-100 dark:border-gray-700 backdrop-blur-sm z-10"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center md:items-start">
            {/* Icon Container */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-2 md:p-3 rounded-xl flex-shrink-0">
              {stats[currentStat].icon}
            </div>

            <div className="ml-3 md:ml-4">
              <motion.div
                key={currentStat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white italic leading-tight"
              >
                <NumberTicker
                  value={stats[currentStat].value}
                  suffix={stats[currentStat].suffix}
                  decimals={stats[currentStat].decimals || 0}
                />
              </motion.div>

              <motion.p
                key={currentStat + 'label'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-[9px] md:text-xs text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest mt-0.5 md:mt-1 whitespace-nowrap"
              >
                {stats[currentStat].label}
              </motion.p>
            </div>
          </div>
        </motion.div>      </div>

      {/* Energy production card - More Compact & Adjusted Position */}
      <motion.div
        className="absolute -top-4 -left-2 md:-top-6 md:-left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2.5 md:p-5 w-44 md:w-64 border border-gray-100 dark:border-gray-700 backdrop-blur-sm z-10"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="flex items-center mb-1 md:mb-2">
          <div className="bg-green-100 dark:bg-green-900/30 p-1 md:p-2 rounded-lg">
            <FiZap className="text-green-600 dark:text-green-400 text-[10px] md:text-base" />
          </div>
          <p className="ml-2 md:ml-3 text-gray-500 dark:text-gray-400 text-[9px] md:text-sm font-medium">Production</p>
        </div>

        <div className="flex items-end space-x-0.5 md:space-x-1 h-6 md:h-12 mb-1 md:mb-2 px-1">
          {/* Bars - Scaled down for mobile */}
          <div className="w-1.5 md:w-3 bg-gradient-to-t from-green-400 to-green-600 rounded-t h-[30%] md:h-4"></div>
          <div className="w-1.5 md:w-3 bg-gradient-to-t from-green-400 to-green-600 rounded-t h-[60%] md:h-8"></div>
          <div className="w-1.5 md:w-3 bg-gradient-to-t from-green-400 to-green-600 rounded-t h-[45%] md:h-6"></div>
          <div className="w-1.5 md:w-3 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t h-[80%] md:h-10"></div>
          <div className="w-1.5 md:w-3 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t h-full md:h-12"></div>
          <div className="w-1.5 md:w-3 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t h-[70%] md:h-9"></div>
          <div className="w-1.5 md:w-3 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t h-[90%] md:h-11"></div>
        </div>

        <p className="text-[9px] md:text-sm font-bold text-gray-900 dark:text-white">
          <span className="text-green-600">+42%</span> ce mois-ci
        </p>
      </motion.div>


      {/* CO2 Savings card - Ultra Compact & High-Left Position */}
      <motion.div
        className="absolute bottom-14 -left-2 md:bottom-16 md:left-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg p-2.5 md:p-5 w-36 md:w-56 backdrop-blur-sm z-10"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <p className="text-[9px] md:text-sm mb-0.5 md:mb-1 font-medium">Réduction CO₂</p>
        <p className="text-base md:text-2xl font-bold leading-none">3.2T</p>
        <p className="text-[7px] md:text-xs opacity-80 mt-0.5 md:mt-1">Annuel</p>

        {/* Circle Icon - Even more compact for mobile */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-5 h-5 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-white rounded-full"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroVisual;