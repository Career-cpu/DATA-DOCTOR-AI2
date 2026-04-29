import { motion } from "framer-motion";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useLanguage } from "../contexts/LanguageContext";

export default function Datasets() {
  const { playHoverSound, playClickSound } = useSoundEffects();
  const { t } = useLanguage();

  return (
    <div className="pt-32 pb-20 min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            {t('datasets.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-500">{t('datasets.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('datasets.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: t('datasets.ds1.title'), desc: t('datasets.ds1.desc'), tags: ["Sales", "Customer", "Retail"] },
            { title: t('datasets.ds2.title'), desc: t('datasets.ds2.desc'), tags: ["Marketing", "ROAS", "Ads"] },
            { title: t('datasets.ds3.title'), desc: t('datasets.ds3.desc'), tags: ["HR", "People", "Analytics"] },
            { title: t('datasets.ds4.title'), desc: t('datasets.ds4.desc'), tags: ["Supply Chain", "Inventory"] },
            { title: t('datasets.ds5.title'), desc: t('datasets.ds5.desc'), tags: ["Finance", "P&L", "Accounting"] },
            { title: t('datasets.ds6.title'), desc: t('datasets.ds6.desc'), tags: ["Support", "CSAT", "Service"] }
          ].map((dataset, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={playHoverSound}
              className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/10 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 border border-purple-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                {dataset.title}
              </h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {dataset.desc}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {dataset.tags.map((tag, j) => (
                  <span key={j} className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-full font-bold uppercase tracking-tight">
                    {tag}
                  </span>
                ))}
              </div>
              <button 
                onClick={playClickSound}
                onMouseEnter={playHoverSound}
                className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-gradient-to-r hover:from-yellow-400 hover:to-purple-600 hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                {t('datasets.download')}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
