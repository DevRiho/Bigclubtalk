import { Link } from "react-router-dom";
import { ArrowRightLeft, BadgeCheck, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";

export function TransferCentre({ posts = [] }) {
  const transferPosts = posts
    .filter((post) => post.tags?.includes("transfer") || post.category?.slug === "transfers")
    .slice(0, 5);

  return (
    <section className="bg-slate-50 dark:bg-slate-900/30 pt-10 pb-12 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader eyebrow="Market watch" title="Transfer Centre" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {["Latest Transfers", "Rumours", "Confirmed Deals"].map((title, index) => (
            <div 
              key={title} 
              className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 rounded-sm shadow-sm"
            >
              <div className="mb-5 flex items-center gap-3">
                {index === 0 && <ArrowRightLeft className="text-brand-blue dark:text-brand-blue" />}
                {index === 1 && <Radio className="text-brand-gold" />}
                {index === 2 && <BadgeCheck className="text-brand-green" />}
                <h3 className="font-headline text-2xl font-black uppercase text-brand-ink dark:text-slate-100">{title}</h3>
              </div>
              
              <div className="grid gap-4">
                {transferPosts.length ? (
                  transferPosts.map((post) => (
                    <Link 
                      key={`${title}-${post._id}`} 
                      to={`/article/${post.slug}`} 
                      className="border-t border-slate-100 dark:border-slate-800/80 pt-4 block group"
                    >
                      <p className="text-sm font-extrabold leading-tight text-brand-ink dark:text-slate-200 group-hover:text-brand-red dark:group-hover:text-brand-red transition-colors">
                        {post.title}
                      </p>
                      <p className="mt-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {post.author?.name || "Newsroom"}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 py-2 border-t border-slate-100 dark:border-slate-800">
                    Transfer stories tagged by editors will appear here.
                  </p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
