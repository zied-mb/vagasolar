import { useState, useEffect } from 'react';
import { SECTION_IDS } from '../constants/navigation';

/**
 * useScrollSection — tracks which section is visible + handles smooth scroll.
 *
 * Replaces the inline scroll logic in Header.jsx.
 *
 * @returns {{
 *   scrolled:       boolean,
 *   activeSection:  string,
 *   handleSmoothScroll: (id: string) => void
 * }}
 */
export const useScrollSection = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const updateActiveSection = () => {
    const scrollPosition = window.scrollY + 100;
    for (const section of SECTION_IDS) {
      const element = document.getElementById(section);
      if (element && scrollPosition >= element.offsetTop) {
        setActiveSection(section);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      updateActiveSection();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSmoothScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return { scrolled, activeSection, handleSmoothScroll };
};
