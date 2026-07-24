import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FALLBACK_SPORTS_IMAGE } from "../../constants/brand";
import { StoryCard } from "../blog/StoryCard";
import { EmptyState } from "../common/EmptyState";

export function HeroSection({ featured = [], trending = [] }) {
  const lead = featured[0];
  const side = trending.slice(0, 4);

  if (!lead) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState 
          title="No lead story published yet" 
          message="Create and publish a featured article from the author dashboard to activate the premium homepage hero." 
        />
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.6fr_.8fr]">
      {/* Lead breaking story */}
      <motion.article 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="group flex flex-col justify-between"
      >
        <div>
          <Link to={`/article/${lead.slug}`} className="relative block overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-950 aspect-[16/9]">
            <img 
              src={lead.coverImage?.url || FALLBACK_SPORTS_IMAGE} 
              alt={lead.coverImage?.alt || lead.title} 
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-103" 
            />
            <div className="absolute left-4 top-4 bg-brand-red px-3 py-1.5 text-[10px] font-black uppercase text-white tracking-widest rounded-sm">
              Breaking News
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
          </Link>
          <div className="mt-5">
            <span className="text-[10px] font-black uppercase text-brand-blue dark:text-brand-gold tracking-widest border-l-2 border-brand-blue dark:border-brand-gold pl-2">
              {lead.category?.name || "Football News"}
            </span>
            <Link to={`/article/${lead.slug}`}>
              <h1 className="mt-3 font-headline text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight text-brand-ink dark:text-slate-100 group-hover:text-brand-red transition-colors">
                {lead.title}
              </h1>
            </Link>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-400">
              {lead.excerpt}
            </p>
          </div>
        </div>
      </motion.article>

      {/* Live storyline rail */}
      <aside className="border-slate-200 dark:border-slate-800 lg:border-l lg:pl-8">
        <div className="border-b-4 border-brand-ink dark:border-slate-200 pb-3">
          <p className="text-xs font-black uppercase tracking-widest text-brand-red">
            Live Storyline
          </p>
        </div>
        <div className="mt-5 grid gap-6">
          {side.map((post, idx) => (
            <motion.div 
              key={post._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <StoryCard post={post} />
            </motion.div>
          ))}
        </div>
      </aside>
    </section>
  );
}
