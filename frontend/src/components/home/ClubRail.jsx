import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FEATURED_CLUBS } from "../../constants/brand";
import { SectionHeader } from "../ui/SectionHeader";

export function ClubRail() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeader eyebrow="Follow the giants" title="Featured Clubs" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        {FEATURED_CLUBS.map((club, index) => (
          <Link 
            key={club} 
            to={`/search?club=${encodeURIComponent(club)}`} 
            className="group block border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 p-6 transition-all duration-300 hover:border-brand-red dark:hover:border-brand-red hover:shadow-md hover:-translate-y-0.5 rounded-sm"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              0{index + 1}
            </span>
            <p className="mt-8 font-headline text-2xl font-black uppercase leading-none text-brand-ink dark:text-slate-100 group-hover:text-brand-red dark:group-hover:text-brand-red transition-colors">
              {club}
            </p>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
