import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const TestimonialCard = ({ testimonial, variants, direction }) => {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="text-center"
    >
      <div className="flex justify-center mb-3 md:mb-8">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <FiStar
              className={`w-4 h-4 md:w-7 md:h-7 lg:w-5 lg:h-5 ${
                i < testimonial.rating
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-sm md:text-3xl lg:text-xl italic text-gray-800 dark:text-gray-200 leading-snug md:leading-relaxed lg:leading-snug font-medium px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        "{testimonial.content}"
      </motion.p>

      <motion.div
        className="mt-4 md:mt-12 flex items-center justify-center flex-col md:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {testimonial.image ? (
          <div className="w-10 h-10 md:w-20 md:h-20 lg:w-14 lg:h-14 rounded-full overflow-hidden border-2 md:border-3 border-amber-400/30 shadow-xl ring-4 ring-amber-400/10 flex items-center justify-center">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="hidden md:flex w-20 h-20 lg:w-14 lg:h-14 rounded-full overflow-hidden border-3 border-amber-400/30 shadow-xl ring-4 ring-amber-400/10 items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-2xl lg:text-xl font-black uppercase tracking-tighter">
            {testimonial.name ? testimonial.name.charAt(0) : 'V'}
          </div>
        )}
        <div className={`text-center md:text-left ${testimonial.image ? 'mt-2 md:mt-0 md:ml-6' : 'mt-0 md:ml-6'}`}>
          <p className="text-base md:text-xl lg:text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {testimonial.name}
          </p>
          <p className="text-amber-600 dark:text-amber-400 font-medium text-[10px] md:text-base lg:text-sm">
            {testimonial.role}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestimonialCard;
