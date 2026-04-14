import React, { useState } from 'react';
import { FiHome, FiBriefcase, FiBatteryCharging, FiTool, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SolarPanel from '../../ui/SolarPanel';
import { SERVICES } from '../../../constants/services';
import ServiceCard from './ServiceCard';
import Stats from '../../common/Stats';

const Services = () => {
  const [activeService, setActiveService] = useState(null);
  const services = SERVICES.map((s) => ({
    ...s,
    icon: s.id === 'residential' ? <FiHome size={36} /> :
      s.id === 'industrial' ? <FiBriefcase size={36} /> :
        s.id === 'storage' ? <FiBatteryCharging size={36} /> :
          <FiTool size={36} />,
  }));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardItem = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    }
  };

  return (
    <section id="services" className="py-28 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Solar flare background */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[200%] max-w-[2000px] h-[800px] bg-radial-gradient(ellipse_at_center, rgba(234,179,8,0.05) 0%, rgba(0,0,0,0) 70%)"></div>

      {/* Floating solar elements */}
      <div className="absolute top-20 right-5 w-24 h-24 opacity-5">
        <SolarPanel />
      </div>
      <div className="absolute bottom-1/4 left-10 w-20 h-20 opacity-5">
        <SolarPanel />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm rounded-full border border-yellow-500/20"
            whileHover={{ scale: 1.05 }}
          >
            <FiSun className="text-yellow-500 mr-2" />
            <span className="text-yellow-700 dark:text-yellow-400 font-medium">Expertise Solaire</span>
          </motion.div>
          <h2 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Solutions <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Énergétiques</span> Complètes
          </h2>
          <p className="mt-5 text-xl text-gray-800 dark:text-gray-400 max-w-3xl mx-auto">
            Des services photovoltaïques haut de gamme pour maximiser votre indépendance énergétique et vos économies.
          </p>
        </motion.div>

        {/* Services grid - 2x2 for all screens */}
        <motion.div
          className="grid grid-cols-2 gap-4 md:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              activeService={activeService}
              setActiveService={setActiveService}
              cardItem={cardItem}
            />
          ))}
        </motion.div>
        
        <div className="mt-12 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const button = document.getElementById("contact-btn-services");
              if (button) {
                // Glow + Pulse
                button.animate(
                  [
                    { boxShadow: "0 0 0px rgba(234,179,8, 0)", transform: "scale(1)" },
                    { boxShadow: "0 0 30px rgba(234,179,8, 0.9)", transform: "scale(1.12)" },
                    { boxShadow: "0 0 50px rgba(234,179,8, 1)", transform: "scale(1.2)" },
                    { boxShadow: "0 0 30px rgba(234,179,8, 0.9)", transform: "scale(1.1)" },
                    { boxShadow: "0 0 40px rgba(234,179,8, 0.7)", transform: "scale(1.15)" },
                    { boxShadow: "0 0 0px rgba(234,179,8, 0)", transform: "scale(1)" }
                  ],
                  { duration: 1200, easing: "ease-in-out" }
                );
              }
              setTimeout(() => {
                const contactSection = document.getElementById("contact");
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" });
                }
              }, 1200);
            }}
            id="contact-btn-services"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-yellow-500/20 transition-all italic"
          >
            Contactez-nous
          </motion.button>
        </div>

        {/* Global Statistics Sync */}
        <Stats className="mt-20" />
      </div>
    </section>
  );
};

export default Services;