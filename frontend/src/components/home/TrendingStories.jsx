import { motion } from "framer-motion";
import { StoryCard } from "../blog/StoryCard";
import { SectionHeader } from "../ui/SectionHeader";
import { EmptyState } from "../common/EmptyState";

export function TrendingStories({ posts = [] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const mainFeature = posts[0];
  const subFeatures = posts.slice(1, 3);
  const sideRail = posts.slice(3, 5);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 pb-4">
      <SectionHeader eyebrow="Most talked about" title="Trending Stories" />
      {posts.length ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          {/* Main feature + sub-features on left */}
          <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col justify-between">
            <StoryCard post={mainFeature} size="feature" />
            
            {subFeatures.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80">
                <div className="grid gap-6 sm:grid-cols-2">
                  {subFeatures.map((post) => (
                    <StoryCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Side rail on right */}
          <motion.div variants={itemVariants} className="grid gap-6">
            {sideRail.map((post) => (
              <StoryCard key={post._id} post={post} />
            ))}
          </motion.div>
        </motion.div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
