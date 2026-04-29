import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useLanguage } from "../contexts/LanguageContext";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Dashboard {
  id: string;
  title: string;
  image: string;
}

export default function Hero() {
  const { playHoverSound, playClickSound } = useSoundEffects();
  const { t } = useLanguage();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const q = query(collection(db, 'dashboards'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          image: doc.data().image
        })) as Dashboard[];
        setDashboards(data);
      } catch (error) {
        console.error("Error fetching dashboards:", error);
      }
    };

    fetchDashboards();
  }, []);

  // Duplicate dashboards to create a continuous grid effect if there are too few
  const displayDashboards = [...dashboards, ...dashboards, ...dashboards].slice(0, 12);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20 max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            {t('hero.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-500">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-12">
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={playHoverSound}
                onClick={playClickSound}
                className="px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl bg-gradient-to-r from-yellow-400 to-purple-500 text-white hover:shadow-purple-500/50 border border-white/20"
              >
                {t('hero.getStarted')}
              </motion.button>
            </Link>
            <a href="#ai-consultant">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={playHoverSound}
                onClick={playClickSound}
                className="px-8 py-4 rounded-full font-bold text-lg transition-all bg-white text-slate-700 hover:bg-slate-50 hover:text-purple-600 border border-slate-200 shadow-lg shadow-slate-200/50"
              >
                {t('hero.exploreAgent')}
              </motion.button>
            </a>
          </div>
        </motion.div>

        {/* Right Scrolling Rows */}
        <div className="relative h-[600px] hidden lg:flex flex-col gap-4 justify-center overflow-hidden" style={{ perspective: '1000px' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-slate-50 z-20 pointer-events-none transition-colors duration-300" />
          
          <div className="absolute inset-0 flex flex-col gap-4 justify-center" style={{ transform: 'rotate(-45deg) scale(1.6)' }}>
            {/* Row 1 (Scrolls Left) */}
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="flex gap-4 w-max"
            >
              {[...displayDashboards, ...displayDashboards].map((dashboard, idx) => (
                <div
                  key={`row1-${dashboard.id}-${idx}`}
                  className="relative w-32 rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-2xl bg-white aspect-[4/3] group shrink-0"
                >
                  <img 
                    src={dashboard.image || `https://picsum.photos/seed/${dashboard.id}/400/300`} 
                    alt={dashboard.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </motion.div>

            {/* Row 2 (Scrolls Right) */}
            <motion.div 
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
              className="flex gap-4 w-max"
            >
              {[...displayDashboards, ...displayDashboards].map((dashboard, idx) => (
                <div
                  key={`row2-${dashboard.id}-${idx}`}
                  className="relative w-32 rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-2xl bg-white aspect-[4/3] group shrink-0"
                >
                  <img 
                    src={dashboard.image || `https://picsum.photos/seed/${dashboard.id}/400/300`} 
                    alt={dashboard.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </motion.div>

            {/* Row 3 (Scrolls Left) */}
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              className="flex gap-4 w-max"
            >
              {[...displayDashboards, ...displayDashboards].map((dashboard, idx) => (
                <div
                  key={`row3-${dashboard.id}-${idx}`}
                  className="relative w-32 rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-2xl bg-white aspect-[4/3] group shrink-0"
                >
                  <img 
                    src={dashboard.image || `https://picsum.photos/seed/${dashboard.id}/400/300`} 
                    alt={dashboard.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </motion.div>

            {/* Row 4 (Scrolls Right) */}
            <motion.div 
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
              className="flex gap-4 w-max"
            >
              {[...displayDashboards, ...displayDashboards].map((dashboard, idx) => (
                <div
                  key={`row4-${dashboard.id}-${idx}`}
                  className="relative w-32 rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-2xl bg-white aspect-[4/3] group shrink-0"
                >
                  <img 
                    src={dashboard.image || `https://picsum.photos/seed/${dashboard.id}/400/300`} 
                    alt={dashboard.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
