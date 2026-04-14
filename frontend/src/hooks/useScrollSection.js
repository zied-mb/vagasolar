import { useState, useEffect, useRef } from 'react';
import { SECTION_IDS } from '../constants/navigation';

/**
 * useScrollSection — tracks which section is visible using Intersection Observer
 * + handles smooth scroll + updates URL hash.
 */
export const useScrollSection = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const isScrollingManually = useRef(false);

  useEffect(() => {
    // 1. Scroll listener for the header appearance (glassmorphism/shadow)
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    // 2. Intersection Observer for Active Section logic
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Detect when section is in the middle of the viewport
      threshold: 0,
    };

    const observerCallback = (entries) => {
      // Don't update active section via observer if we are currently handling a manual smooth scroll
      if (isScrollingManually.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
          
          // Update URL hash without jumping/reloading
          if (window.location.pathname === '/') {
            const newHash = sectionId === 'home' ? '' : `#${sectionId}`;
            const currentHash = window.location.hash;
            
            if (currentHash !== newHash) {
              window.history.replaceState(null, '', `/${newHash}`);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleSmoothScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      isScrollingManually.current = true;
      setActiveSection(id);
      
      // Update hash immediately for manual clicks
      const newHash = id === 'home' ? '' : `#${id}`;
      window.history.replaceState(null, '', `/${newHash}`);

      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });

      // Reset manual scroll flag after animation completes
      setTimeout(() => {
        isScrollingManually.current = false;
      }, 1000);
    }
  };

  return { scrolled, activeSection, handleSmoothScroll };
};
