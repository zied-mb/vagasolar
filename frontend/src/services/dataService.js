const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─── Promise Singletons ───
// These store in-flight promises so that multiple callers get the SAME result 
// without triggering multiple network requests.
let projectsPromise = null;
let testimonialsPromise = null;
let stegRatesPromise = null;

// ─── Cache Storage ───
let cachedProjects = null;
let cachedTestimonials = null;
let cachedStegRates = null;

const dataService = {
  /**
   * Fetches the full list of published projects.
   * Dedupes concurrent requests.
   */
  getProjects: async (forceRefresh = false) => {
    if (cachedProjects && !forceRefresh) return { success: true, projects: cachedProjects };
    if (projectsPromise && !forceRefresh) return projectsPromise;

    projectsPromise = fetch(`${API_URL}/api/projects`)
      .then(r => r.json())
      .then(data => {
        if (data.success) cachedProjects = data.projects;
        projectsPromise = null; // Clear promise once resolved
        return data;
      })
      .catch(err => {
        projectsPromise = null;
        throw err;
      });

    return projectsPromise;
  },

  /**
   * Fetches the full list of published testimonials.
   * Dedupes concurrent requests.
   */
  getTestimonials: async (forceRefresh = false) => {
    if (cachedTestimonials && !forceRefresh) return { success: true, testimonials: cachedTestimonials };
    if (testimonialsPromise && !forceRefresh) return testimonialsPromise;

    testimonialsPromise = fetch(`${API_URL}/api/testimonials`)
      .then(r => r.json())
      .then(data => {
        if (data.success) cachedTestimonials = data.testimonials;
        testimonialsPromise = null;
        return data;
      })
      .catch(err => {
        testimonialsPromise = null;
        throw err;
      });

    return testimonialsPromise;
  },

  /**
   * Fetches dynamic STEG rates for the simulator.
   * Dedupes concurrent requests.
   */
  getStegRates: async (forceRefresh = false) => {
    if (cachedStegRates && !forceRefresh) return { success: true, rates: cachedStegRates };
    if (stegRatesPromise && !forceRefresh) return stegRatesPromise;

    stegRatesPromise = fetch(`${API_URL}/api/steg-rates`)
      .then(r => r.json())
      .then(data => {
        if (data.success) cachedStegRates = data.rates;
        stegRatesPromise = null;
        return data;
      })
      .catch(err => {
        stegRatesPromise = null;
        throw err;
      });

    return stegRatesPromise;
  },

  /**
   * Utility to clear all caches (e.g., after an admin update)
   */
  clearCache: () => {
    cachedProjects = null;
    cachedTestimonials = null;
    cachedStegRates = null;
    projectsPromise = null;
    testimonialsPromise = null;
    stegRatesPromise = null;
  }
};

export default dataService;
