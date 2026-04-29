import { motion } from "framer-motion";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useLanguage } from "../contexts/LanguageContext";

export default function Testimonials() {
  const { playHoverSound } = useSoundEffects();
  const { t } = useLanguage();

  const testimonials = [
    {
      quote: t('testimonials.quote1'),
      name: "Nguyễn Văn A",
      title: t('testimonials.role1'),
      company: "TechCorp Vietnam",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    {
      quote: t('testimonials.quote2'),
      name: "Trần Thị B",
      title: t('testimonials.role2'),
      company: "Retail Group",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      quote: t('testimonials.quote3'),
      name: "Lê Hoàng C",
      title: t('testimonials.role3'),
      company: "E-commerce Solutions",
      avatar: "https://i.pravatar.cc/150?img=8"
    }
  ];

  return (
    <section className="pt-12 pb-32 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm font-display">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onMouseEnter={playHoverSound}
              className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 hover:bg-slate-50 transition-all flex flex-col h-full cursor-pointer"
            >
              <div className="text-purple-600 mb-6 opacity-30">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21L16.41 14.5916H11.4692V3H21.4692V14.5916L19.0762 21H14.017ZM4.017 21L6.41 14.5916H1.46924V3H11.4692V14.5916L9.0762 21H4.017Z" />
                </svg>
              </div>
              <p className="text-slate-700 leading-relaxed mb-8 flex-1 italic text-lg font-medium">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">
                    {testimonial.title}, <span className="text-purple-600">{testimonial.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
