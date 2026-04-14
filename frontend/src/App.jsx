import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { io } from 'socket.io-client';
import Notification from './components/ui/Notification';

import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import ScrollToTopButton from './components/layout/ScrollToTopButton';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─── Lazy Loaded Sections (Code Splitting for Performance) ───────────────────
const Hero = lazy(() => import('./components/sections/Hero/Hero'));
const Services = lazy(() => import('./components/sections/Services/Services'));
const About = lazy(() => import('./components/sections/About/About'));
const Projects = lazy(() => import('./components/sections/Projects/Projects'));
const Testimonials = lazy(() => import('./components/sections/Testimonials/Testimonials'));
const Contact = lazy(() => import('./components/sections/Contact/Contact'));

// Admin & Project Galleries
const ProtectedRoute = lazy(() => import('./admin/components/ProtectedRoute'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminLeads = lazy(() => import('./admin/pages/AdminLeads'));
const AdminLeadDetail = lazy(() => import('./admin/pages/AdminLeadDetail'));
const AdminStegRates = lazy(() => import('./admin/pages/AdminStegRates'));
const AdminProjects = lazy(() => import('./admin/pages/AdminProjects'));
const AdminTestimonials = lazy(() => import('./admin/pages/AdminTestimonials'));
const AdminMessages = lazy(() => import('./admin/pages/AdminMessages'));
const AdminSubscribers = lazy(() => import('./admin/pages/AdminSubscribers'));
const ProjectDetail = lazy(() => import('./components/sections/Projects/ProjectDetail'));
const ProjectFullGallery = lazy(() => import('./components/sections/Projects/ProjectFullGallery'));
const NotFound = lazy(() => import('./components/pages/NotFound'));

// ─── Fallback Loader for Suspense ─────────────────────────────────────────────
const PageLoader = () => (
  <div className="w-full h-screen flex items-center justify-center bg-gray-950">
    <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ─── Hash Scroll Handler ─────────────────────────────────────────────────────
const ScrollToHashElement = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');

      const executeScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };


      let found = executeScroll();


      if (!found) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (executeScroll() || attempts >= 10) {
            clearInterval(interval);
          }
        }, 100);
      }


      setTimeout(executeScroll, 600);
      setTimeout(executeScroll, 1200);
    }
  }, [location.pathname, location.hash]);

  return null;
};

// ─── SEO Metadata Component ───────────────────────────────────────────────────
const schemaData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Vaga Solar",
  "image": "https://vagasolar.tn/og-image.jpg",
  "url": "https://vagasolar.tn",
  "telephone": "+216 40 018 523",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Tunis",
    "addressCountry": "TN"
  },
  "priceRange": "$$$"
};

const SEO = () => (
  <Helmet>
    <title>Vaga Solar | Solutions d'Énergie Solaire Premium en Tunisie</title>
    <meta name="description" content="Expert en installation de panneaux photovoltaïques en Tunisie. Économisez sur vos factures avec le luxe, la performance et l'ingénierie de Vaga Solar." />
    <meta name="keywords" content="solaire tunisie, panneaux photovoltaïques, énergie renouvelable, STEG, installation solaire" />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://vagasolar.tn/" />
    <meta property="og:title" content="Vaga Solar | Énergie Solaire Premium" />
    <meta property="og:description" content="Passez à l'énergie solaire. Installation premium, rentabilité maximale." />
    <meta property="og:image" content="https://vagasolar.tn/og-image.jpg" />

    {/* Twitter */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://vagasolar.tn/" />
    <meta property="twitter:title" content="Vaga Solar | Énergie Solaire" />
    <meta property="twitter:description" content="L'excellence photovoltaïque en Tunisie." />
    <meta property="twitter:image" content="https://vagasolar.tn/og-image.jpg" />

    {/* Structured Data / Schema.org */}
    <script type="application/ld+json">
      {JSON.stringify(schemaData)}
    </script>
  </Helmet>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────
const LandingPage = ({ darkMode, setDarkMode }) => (
  <div className={`${darkMode ? 'dark bg-gray-900' : 'bg-white'} transition-colors duration-300 w-full overflow-hidden`}>
    <SEO />
    <div className="w-full mx-auto">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div></div>}>
        <Hero />
        <Services />
        <About />
        <Projects />
        <Testimonials />
        <Contact />
      </Suspense>
      <Footer />
      <ScrollToTopButton />
    </div>
  </div>
);
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Real-time Notification State
  const [rtNotify, setRtNotify] = useState({ show: false, message: '' });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Socket.IO Listener Initialization
  React.useEffect(() => {
    const socket = io(API_URL, { withCredentials: true });

    socket.on('connect', () => {

    });

    socket.on('new-message', (data) => {
      setRtNotify({
        show: true,
        message: `Transmission réussie. Merci ${data.name.split(' ')[0]}, nous vous répondrons sous 24h.`
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <HelmetProvider>
      <Notification 
        show={rtNotify.show} 
        message={rtNotify.message} 
        onDismiss={() => setRtNotify({ ...rtNotify, show: false })}
      />
      <Router>
        <ScrollToHashElement />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage darkMode={darkMode} setDarkMode={setDarkMode} />} />

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="leads/:id" element={<AdminLeadDetail />} />
              <Route path="steg-rates" element={<AdminStegRates />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
            </Route>

            <Route path="/projects/:id" element={<ProjectDetail darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/gallery" element={<ProjectFullGallery darkMode={darkMode} setDarkMode={setDarkMode} />} />

            {/* ── 404 Fallback ───────────────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;