import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useSoundEffects } from "../hooks/useSoundEffects";

interface Dashboard {
  id: string;
  subtitle: string;
  title: string;
  image: string;
  thumb: string;
  url: string;
  desc: string;
  order: number;
}

export default function DashboardCarousel() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const { playHoverSound, playClickSound } = useSoundEffects();

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const q = query(collection(db, 'dashboards'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Dashboard[];
        
        setDashboards(data);
        if (data.length > 0) {
          setActiveItemId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching dashboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboards();
  }, []);

  if (loading) {
    return (
      <section id="showcase" className="py-24 bg-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-yellow-400 animate-pulse text-xl font-medium">Đang tải dữ liệu...</div>
      </section>
    );
  }

  if (dashboards.length === 0) {
    return (
      <section id="showcase" className="py-24 bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center">
        <div className="text-slate-400 text-xl mb-4">Chưa có Dashboard nào được thêm.</div>
        <a href="/admin" className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-purple-600 rounded-full hover:from-yellow-400 hover:to-purple-500 transition-colors">Đến trang Quản trị</a>
      </section>
    );
  }

  const currentIndex = dashboards.findIndex(d => d.id === activeItemId);
  const activeItem = dashboards[currentIndex] || dashboards[0];

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % dashboards.length;
    setDirection(1);
    setActiveItemId(dashboards[nextIndex].id);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + dashboards.length) % dashboards.length;
    setDirection(-1);
    setActiveItemId(dashboards[prevIndex].id);
  };

  const handleThumbnailClick = (clickedItem: Dashboard) => {
    const nextIndex = dashboards.findIndex(d => d.id === clickedItem.id);
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setActiveItemId(clickedItem.id);
  };

  const getThumbnails = () => {
    if (dashboards.length <= 1) return [];
    const thumbs = [];
    const count = Math.min(3, dashboards.length - 1);
    for (let i = 1; i <= count; i++) {
      thumbs.push(dashboards[(currentIndex + i) % dashboards.length]);
    }
    return thumbs;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

  const thumbnailVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <section id="showcase" className="relative w-full h-screen overflow-hidden bg-white font-sans text-slate-900">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeItem.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0"
          >
            <img
              src={activeItem.image}
              className="w-full h-full object-cover"
              alt={activeItem.title}
            />
            {/* Overlay for better text readability in light mode */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Main Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-20 pb-12 md:pb-20">
        <div className="flex flex-col lg:flex-row items-end justify-between w-full gap-10">
          
          {/* Left Content (Bottom Left) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-end z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xs md:text-sm tracking-[0.2em] uppercase mb-2 text-purple-600 font-bold">{activeItem.subtitle}</p>
                <h1 className="text-5xl md:text-7xl lg:text-[100px] font-bold uppercase leading-[0.9] mb-6 font-display text-slate-900" style={{ fontFamily: "'Anton', sans-serif" }}>
                  {activeItem.title.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h1>
                <p className="text-sm md:text-base text-slate-700 max-w-md mb-8 line-clamp-3 font-medium">
                  {activeItem.desc}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href={activeItem.url} target="_blank" rel="noreferrer" onMouseEnter={playHoverSound} onClick={playClickSound} className="inline-flex items-center justify-center px-8 py-3 border border-purple-500 rounded-full text-xs tracking-widest uppercase hover:bg-purple-500 hover:text-white transition-all backdrop-blur-sm font-bold">
                    View Dashboard
                  </a>
                  <a href="#buy" onMouseEnter={playHoverSound} onClick={playClickSound} className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-yellow-500 to-purple-600 rounded-full text-xs tracking-widest uppercase hover:from-yellow-400 hover:to-purple-500 transition-colors text-white font-bold shadow-lg shadow-purple-500/20">
                    Buy Now
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Content - Navigation + Thumbnails (Bottom Right) */}
          <div className="w-full lg:w-1/2 flex items-center justify-start lg:justify-end z-10 overflow-hidden gap-6">
            
            {/* Navigation Buttons */}
            <div className="flex gap-3 shrink-0">
              <button onClick={() => { handlePrev(); playClickSound(); }} onMouseEnter={playHoverSound} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-purple-200 flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors backdrop-blur-md bg-white/80 shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button onClick={() => { handleNext(); playClickSound(); }} onMouseEnter={playHoverSound} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-purple-200 flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors backdrop-blur-md bg-white/80 shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 md:gap-6 w-full max-w-[850px] overflow-hidden">
              <AnimatePresence mode="popLayout" custom={direction}>
                {getThumbnails().map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    custom={direction}
                    variants={thumbnailVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="relative w-48 h-28 md:w-64 md:h-36 rounded-2xl overflow-hidden shrink-0 cursor-pointer group shadow-xl border border-white"
                    onClick={() => { handleThumbnailClick(item); playClickSound(); }}
                    onMouseEnter={playHoverSound}
                  >
                    <img src={item.thumb} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 p-3 md:p-4 w-full flex flex-col justify-end">
                      <p className="text-purple-600 text-[10px] md:text-xs uppercase tracking-wider truncate mb-1 font-bold">{item.subtitle}</p>
                      <h3 className="text-slate-900 font-bold text-sm md:text-lg uppercase leading-tight font-display" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}>{item.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
