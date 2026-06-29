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
        <EmptyState title="No lead story published yet" message="Create and publish a featured article from the author dashboard to activate the premium homepage hero." />
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.6fr_.8fr]">
      <motion.article initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="group">
        <Link to={`/article/${lead.slug}`} className="relative block overflow-hidden">
          <img src={lead.coverImage?.url || FALLBACK_SPORTS_IMAGE} alt={lead.coverImage?.alt || lead.title} className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute left-4 top-4 bg-brand-red px-3 py-2 text-xs font-black uppercase text-white">Breaking News</div>
        </Link>
        <div className="mt-5 max-w-4xl">
          <p className="text-xs font-black uppercase text-brand-blue">{lead.category?.name || "Football News"}</p>
          <Link to={`/article/${lead.slug}`}>
            <h1 className="mt-2 font-headline text-5xl font-black uppercase leading-none text-brand-ink md:text-7xl">{lead.title}</h1>
          </Link>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{lead.excerpt}</p>
        </div>
      </motion.article>

      <aside className="border-l-0 border-slate-200 lg:border-l lg:pl-8">
        <p className="border-b-4 border-brand-ink pb-3 text-xs font-black uppercase text-brand-red">Live Storyline</p>
        <div className="mt-5 grid gap-5">
          {side.map((post) => (
            <StoryCard key={post._id} post={post} />
          ))}
        </div>
      </aside>
    </section>
  );
}
