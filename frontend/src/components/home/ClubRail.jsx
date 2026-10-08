import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FEATURED_CLUBS } from "../../constants/brand";
import { SectionHeader } from "../ui/SectionHeader";

const CLUB_LOGOS = {
  "Manchester United": "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  "Arsenal": "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  "Chelsea": "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
  "Liverpool": "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
  "Manchester City": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  "Barcelona": "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  "Real Madrid": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  "Bayern Munich": "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg"
};

export function ClubRail() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeader eyebrow="Follow the giants" title="Featured Clubs" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {FEATURED_CLUBS.map((club) => (
          <Link 
            key={club} 
            to={`/search?club=${encodeURIComponent(club)}`} 
            className="group flex h-32 md:h-40 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-100 hover:shadow-sm dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-800"
            aria-label={`${club} news`}
          >
            <img 
              src={CLUB_LOGOS[club]} 
              alt={`${club} logo`} 
              className="h-full w-full object-contain opacity-50 grayscale filter transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-70 dark:opacity-60 dark:invert dark:group-hover:opacity-80"
            />
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
