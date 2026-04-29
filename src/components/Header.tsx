import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useLanguage } from "../contexts/LanguageContext";

export default function Header() {
  const { playClickSound, playHoverSound } = useSoundEffects();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-5xl mx-auto h-16 flex items-center justify-between bg-white/95 backdrop-blur-xl border border-slate-200 rounded-full px-6 shadow-2xl shadow-purple-900/10 transition-colors duration-300">
        <Link to="/" className="flex items-center gap-2" onMouseEnter={playHoverSound} onClick={playClickSound}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-yellow-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30">
            D
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Data Doctor</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#showcase" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-sm font-medium transition-colors hover:text-purple-600 text-slate-600">{t('nav.showcase')}</a>
          <a href="/#ai-consultant" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-sm font-medium transition-colors hover:text-purple-600 text-slate-600">{t('nav.aiConsultant')}</a>
          <Link to="/playground" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-sm font-medium transition-colors hover:text-purple-600 text-slate-600">{t('nav.playground')}</Link>
          <Link to="/blog" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-sm font-medium transition-colors hover:text-purple-600 text-slate-600">{t('nav.blog')}</Link>
          <Link to="/datasets" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-sm font-medium transition-colors hover:text-purple-600 text-slate-600">{t('nav.datasets')}</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              playClickSound();
              toggleLanguage();
            }}
            onMouseEnter={playHoverSound}
            className="p-2 text-slate-500 hover:text-purple-600 transition-colors rounded-full hover:bg-slate-100 text-sm font-medium"
          >
            {language === 'en' ? 'EN' : 'VI'}
          </button>
          
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg bg-gradient-to-r from-yellow-400 to-purple-500 text-white hover:shadow-purple-500/50 border border-white/20"
            >
              {t('nav.getDiagnosis')}
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  );
}
