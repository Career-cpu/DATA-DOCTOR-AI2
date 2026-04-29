import { motion } from "framer-motion";

const logos = [
  { name: "Company 1", url: "https://picsum.photos/seed/logo1/200/100" },
  { name: "Company 2", url: "https://picsum.photos/seed/logo2/200/100" },
  { name: "Company 3", url: "https://picsum.photos/seed/logo3/200/100" },
  { name: "Company 4", url: "https://picsum.photos/seed/logo4/200/100" },
  { name: "Company 5", url: "https://picsum.photos/seed/logo5/200/100" },
  { name: "Company 6", url: "https://picsum.photos/seed/logo6/200/100" },
  { name: "Company 7", url: "https://picsum.photos/seed/logo7/200/100" },
];

export default function ClientLogos() {
  return (
    <section className="py-6 bg-transparent border-y border-white/10 overflow-hidden relative z-10">
      
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 md:gap-24 px-6">
          {[...logos, ...logos].map((logo, index) => (
            <img
              key={index}
              src={logo.url}
              alt={logo.name}
              className="h-8 md:h-10 object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 drop-shadow-md cursor-pointer"
            />
          ))}
        </div>
        
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-12 md:gap-24 px-6">
          {[...logos, ...logos].map((logo, index) => (
            <img
              key={`copy-${index}`}
              src={logo.url}
              alt={logo.name}
              className="h-8 md:h-10 object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 drop-shadow-md cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
