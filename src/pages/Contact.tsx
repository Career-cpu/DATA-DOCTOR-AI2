import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useLanguage } from "../contexts/LanguageContext";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { playHoverSound, playClickSound, playSuccessSound } = useSoundEffects();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    playSuccessSound();
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-transparent relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/20 to-transparent opacity-50 pointer-events-none"></div>
      
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            {t('contact.success')}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 font-display">
            {t('contact.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-500">{t('contact.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.name')}</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-slate-400"
                  placeholder={t('contact.namePlaceholder')}
                  required
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.company')}</label>
                <input 
                  type="text" 
                  id="company" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-slate-400"
                  placeholder={t('contact.companyPlaceholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.email')}</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-slate-400"
                  placeholder={t('contact.emailPlaceholder')}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.phone')}</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-slate-400"
                  placeholder={t('contact.phonePlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.service')}</label>
              <select 
                id="service" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="dashboard" className="bg-white">{t('contact.service1')}</option>
                <option value="etl" className="bg-white">{t('contact.service2')}</option>
                <option value="consulting" className="bg-white">{t('contact.service3')}</option>
                <option value="other" className="bg-white">{t('contact.service4')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.message')}</label>
              <textarea 
                id="message" 
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none placeholder-slate-400"
                placeholder={t('contact.messagePlaceholder')}
              ></textarea>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                onMouseEnter={playHoverSound}
                onClick={playClickSound}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-purple-500 transition-colors shadow-xl shadow-purple-900/20 flex items-center justify-center gap-2"
              >
                {t('contact.submit')}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </motion.button>
            </div>
            
            <p className="text-center text-xs text-slate-500 mt-6" dangerouslySetInnerHTML={{ __html: t('contact.privacyNote') }}>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
