import React from 'react';
import { motion } from 'framer-motion';

const SimulatorForm = ({
  typeBatiment, setTypeBatiment,
  consommation, setConsommation,
  couverture, setCouverture,
  currentStep,
  handleSubmit,
  nextStep,
  prevStep
}) => {
  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === step ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              {step}
            </div>
            <span className="text-xs mt-1">{['Bâtiment', 'Consommation', 'Configuration'][step - 1]}</span>
          </div>
        ))}
      </div>

      <motion.form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        {/* Step 1 */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Type de raccordement</label>
              <select
                value={typeBatiment}
                onChange={(e) => setTypeBatiment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-white transition-shadow shadow-sm bg-white"
              >
                <option value="residential">Résidentiel</option>
                <option value="professional">Professionnel / Tertiaire</option>
                <option value="agricultural">Agricole</option>
              </select>
            </div>
            <div className="flex justify-end pt-4">
              <button type="button" onClick={nextStep} className="py-3 px-6 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors shadow-md">Suivant</button>
            </div>
          </motion.div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Consommation STEG (kWh / mois)</label>
              <input
                type="number"
                value={consommation}
                onChange={(e) => setConsommation(e.target.value)}
                placeholder="Ex: 350"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-white transition-shadow shadow-sm bg-white"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Saisissez la consommation électrique moyenne lue sur votre facture.</p>
            </div>
            <div className="flex justify-between pt-4">
              <button type="button" onClick={prevStep} className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Retour</button>
              <button type="button" onClick={nextStep} className="py-3 px-6 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors shadow-md">Suivant</button>
            </div>
          </motion.div>
        )}

        {/* Step 3 — Configuration */}
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4">
              <label className="block mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Cible de couverture solaire partagée (%)</label>
              <input 
                type="range" 
                value={couverture} 
                onChange={(e) => setCouverture(parseFloat(e.target.value))} 
                min="10" 
                max="100" 
                step="5" 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-yellow-500" 
              />
              <div className="flex justify-between text-sm font-bold text-yellow-600 dark:text-yellow-500 mt-2">
                <span>10%</span>
                <span className="text-xl">{couverture}%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">Estimation du taux de couverture énergétique visé par l'installation photovoltaïque.</p>
            </div>
            
            <div className="flex justify-between pt-2">
              <button type="button" onClick={prevStep} className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Retour</button>
              <button type="submit" className="py-3 px-6 bg-gradient-to-r from-amber-400 to-yellow-600 text-white rounded-xl font-bold shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-0.5 transition-all">Lancer l'audit</button>
            </div>
          </motion.div>
        )}
      </motion.form>
    </div>
  );
};

export default SimulatorForm;
