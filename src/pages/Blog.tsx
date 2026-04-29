import { motion } from "framer-motion";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useLanguage } from "../contexts/LanguageContext";

export default function Blog() {
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
            {t('blog.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-500">{t('blog.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 hover:border-purple-300 transition-all group cursor-pointer"
            >
              <div className="h-48 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-900/5 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={`https://picsum.photos/seed/data${i}/800/600`} 
                  alt="Blog cover" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3">{t('blog.category')}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {t('blog.postTitle')}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                  {t('blog.postDesc')}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{t('blog.date')}</span>
                  <span>{t('blog.readTime')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
