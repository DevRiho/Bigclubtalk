import { motion } from "framer-motion";

export function BreakingTicker({ posts = [] }) {
  const headlines = posts.length 
    ? posts.map((post) => post.title) 
    : ["Editors are preparing the next Big Club Talk live file"];

  return (
    <section className="border-y border-brand-ink dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl overflow-hidden px-4">
        <div className="flex shrink-0 items-center bg-brand-red px-4 py-3 text-[10px] font-black uppercase text-white tracking-widest rounded-sm">
          Breaking
        </div>
        <div className="relative flex flex-1 items-center overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap text-xs font-black uppercase text-brand-ink dark:text-slate-100 tracking-wider"
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
