import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useLanguage } from "../contexts/LanguageContext";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface StoreDashboard {
  id: string;
  title: string;
  category: string;
  desc: string;
  url: string;
  image: string;
  price: string;
  paymentLink: string;
  order: number;
  isBestSeller?: boolean;
}

export default function DashboardGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [dashboards, setDashboards] = useState<StoreDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const { playHoverSound, playClickSound } = useSoundEffects();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const q = query(collection(db, 'store_dashboards'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StoreDashboard[];
        setDashboards(data);
      } catch (error) {
        console.error("Error fetching store dashboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboards();
  }, []);

  const filteredDashboards = (activeCategory === "All" 
    ? dashboards 
    : dashboards.filter(d => d.category === activeCategory)).sort((a, b) => (b.isBestSeller === true ? 1 : 0) - (a.isBestSeller === true ? 1 : 0) || a.order - b.order);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(dashboards.map(d => d.category).filter(Boolean));
    return ["All", ...Array.from(uniqueCategories)];
  }, [dashboards]);

  return (
    <section id="templates" className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
            {t('gallery.title')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="sticky top-28 bg-white backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-xl shadow-purple-900/5">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 uppercase tracking-wider text-sm">{t('gallery.categories')}</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => { setActiveCategory(category); playClickSound(); }}
                      onMouseEnter={playHoverSound}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                        activeCategory === category
                          ? "bg-gradient-to-r from-purple-600 to-yellow-500 text-white shadow-md shadow-purple-500/20"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {category === 'All' ? t('gallery.all') : category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Content - Grid */}
          <div className="w-full lg:w-3/4">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredDashboards.map((dashboard) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={dashboard.id}
                    className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 flex flex-col h-full"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[4/3] overflow-hidden p-3">
                      <div className="w-full h-full rounded-lg overflow-hidden border border-slate-100 relative">
                        <img 
                          src={dashboard.image || `https://picsum.photos/seed/${dashboard.id}/800/600`} 
                          alt={dashboard.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                      </div>
                      <div className="absolute top-5 right-5 flex flex-col gap-2 items-end">
                        {dashboard.isBestSeller && (
                          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-yellow-500/20">
                            {t('gallery.bestSeller')}
                          </div>
                        )}
                        <div className="bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-purple-600 border border-purple-100 uppercase tracking-tight">
                          {dashboard.category}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5 line-clamp-1">{dashboard.title}</h3>
                      <p className="text-xs text-slate-600 mb-4 flex-1 line-clamp-2">{dashboard.desc}</p>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-auto">
                        <a 
                          href={dashboard.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-4 rounded-md bg-gradient-to-r from-yellow-400 to-purple-500 text-white font-bold text-xs hover:shadow-lg hover:shadow-purple-500/30 transition-all text-center flex-1"
                        >
                          Preview
                        </a>
                        <a 
                          href={dashboard.paymentLink || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-4 rounded-md border border-purple-500 text-purple-600 font-bold text-xs hover:bg-purple-50 transition-colors text-center flex-1"
                        >
                          Buy - {dashboard.price}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {loading ? (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
                <p className="text-slate-400">Loading templates...</p>
              </div>
            ) : filteredDashboards.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
                <p className="text-slate-400">No templates found in this category.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
