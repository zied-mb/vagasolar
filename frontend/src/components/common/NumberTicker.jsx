import React, { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, motion, useInView } from 'framer-motion';

/**
 * NumberTicker Component
 * 
 * @param {number} value - The target number to count towards
 * @param {string} suffix - Text to append after the number (e.g. "+", "MWc")
 * @param {number} decimals - Precision of the number
 * @param {number} duration - Sync duration indicator (not used directly with springs but conceptually)
 */
const NumberTicker = ({ value, suffix = "", decimals = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  
  // Motion value starting at 0
  const motionValue = useMotionValue(0);
  
  // Spring configuration for the "Luxury" ease-out effect:
  // - High stiffness for a fast start
  // - Strategic damping to slow down smoothly and prevent overshooting too much
  const springValue = useSpring(motionValue, {
    stiffness: 40, 
    damping: 20, 
    restDelta: 0.001
  });

  // Transform the numerical value into a formatted string
  const displayValue = useTransform(springValue, (latest) => {
    return latest.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  });

  useEffect(() => {
    if (isInView) {
      // Set the target value when the component enters the viewport
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{displayValue}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
};

export default NumberTicker;
