import { useState, useEffect } from 'react';

/**
 * useStatCycle — cycles through an array of stats on a fixed interval.
 *
 * Replaces the inline setInterval + useState in Hero.jsx.
 *
 * @param {Array}  items            - The array to cycle through
 * @param {number} intervalMs       - Milliseconds between transitions (default: 3000)
 * @returns {{ currentIndex: number, currentItem: any }}
 */
export const useStatCycle = (items, intervalMs = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [items, intervalMs]);

  return {
    currentIndex,
    currentItem: items?.[currentIndex],
  };
};
