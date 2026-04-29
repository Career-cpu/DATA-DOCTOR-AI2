import { Link } from "react-router-dom";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { playHoverSound, playClickSound } = useSoundEffects();
  const { t } = useLanguage();

  return (
    <footer className="bg-white text-slate-600 py-16 border-t border-slate-200 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" onClick={playClickSound} onMouseEnter={playHoverSound} className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              D
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Data Doctor</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-sm">
            {t('footer.desc')}
          </p>
        </div>
        <div>
          <h4 className="text-slate-900 font-bold mb-4 uppercase tracking-wider text-xs">{t('footer.services')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/#showcase" onClick={playClickSound} onMouseEnter={playHoverSound} className="hover:text-purple-600 transition-colors font-medium">{t('footer.service1')}</a></li>
            <li><a href="/#ai-consultant" onClick={playClickSound} onMouseEnter={playHoverSound} className="hover:text-purple-600 transition-colors font-medium">{t('footer.service2')}</a></li>
            <li><a href="/#services" onClick={playClickSound} onMouseEnter={playHoverSound} className="hover:text-purple-600 transition-colors font-medium">{t('footer.service3')}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-slate-900 font-bold mb-4 uppercase tracking-wider text-xs">{t('footer.contact')}</h4>
          <ul className="space-y-2 text-sm">
            <li className="font-medium">Email: contact@datadoctor.vn</li>
            <li className="font-medium">Hotline: 090 123 4567</li>
            <li className="pt-4">
              <Link to="/contact" onClick={playClickSound} onMouseEnter={playHoverSound} className="text-purple-600 hover:text-purple-700 font-bold" dangerouslySetInnerHTML={{ __html: t('footer.getConsultation') }}>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest font-bold text-slate-400">
        <p>&copy; {new Date().getFullYear()} Data Doctor. All rights reserved.</p>
        <p className="mt-4 md:mt-0">{t('footer.privacy')}</p>
      </div>
    </footer>
  );
}
