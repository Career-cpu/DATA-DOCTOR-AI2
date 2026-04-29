import Hero from "../components/Hero";
import ClientLogos from "../components/ClientLogos";
import DashboardGallery from "../components/DashboardGallery";
import AIDataDoctor from "../components/AIDataDoctor";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <div className="relative text-slate-900">
      <div className="relative z-10">
        <Hero />
      </div>

      <div className="relative z-10">
        <ClientLogos />
      </div>

      <div className="relative z-10">
        <DashboardGallery />
      </div>
      
      <div id="ai-consultant" className="relative z-10 pt-20">
        <AIDataDoctor />
      </div>
      
      <div className="relative z-10">
        <Testimonials />
      </div>
    </div>
  );
}
