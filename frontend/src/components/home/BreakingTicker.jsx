import { motion } from "framer-motion";

export function BreakingTicker({ posts = [] }) {
  const headlines = posts.length ? posts.map((post) => post.title) : ["Editors are preparing the next Big Club Talk live file"];

  return (
    <section className="border-y border-brand-ink bg-white">
      <div className="mx-auto flex max-w-7xl overflow-hidden px-4">
        <div className="flex shrink-0 items-center bg-brand-red px-4 py-3 text-xs font-black uppercase text-white">Breaking</div>
        <div className="relative flex flex-1 items-center overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap text-sm font-extrabold uppercase text-brand-ink"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          >
            {[...headlines, ...headlines].map((headline, index) => (
              <span key={`${headline}-${index}`} className="px-8">
                {headline}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
