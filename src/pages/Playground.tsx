import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Playground() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setIsCorrect(index === 1); // Assuming answer 1 is correct
  };

  return (
    <div className="min-h-screen pt-32 pb-20 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Playground</h2>
          <p className="text-slate-600 font-medium">Interact with the live dashboard and answer the question below.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden h-[500px] relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-10">
               <span className="text-slate-900 text-2xl font-bold mb-2">Interactive Dashboard</span>
               <span className="text-slate-600 text-sm font-medium">Explore the data to find the answer</span>
            </div>
            <img src="https://picsum.photos/seed/dashboard-play/800/500" className="w-full h-full object-cover opacity-60" alt="Dashboard Placeholder" />
          </div>
          
          <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">?</span>
              Data Challenge
            </h3>
            <p className="text-slate-700 mb-8 leading-relaxed font-bold">Based on the dashboard, which region had the highest sales growth in Q3?</p>
            
            <div className="space-y-4 flex-1">
              {['North America', 'Europe', 'Asia Pacific', 'Latin America'].map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-bold transition-all ${
                    selectedAnswer === idx 
                      ? isCorrect && selectedAnswer === idx 
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-purple-200 hover:bg-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            {selectedAnswer !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-8 p-5 rounded-2xl border-2 font-bold ${isCorrect ? 'bg-green-50 text-green-700 border-green-500/20' : 'bg-red-50 text-red-700 border-red-500/20'}`}
              >
                {isCorrect ? 'Correct! Europe saw a 25% increase in Q3.' : 'Incorrect. Take a closer look at the regional breakdown chart.'}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
