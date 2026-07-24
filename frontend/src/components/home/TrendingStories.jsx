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

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeader eyebrow="Most talked about" title="Trending Stories" />
      {posts.length ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          <motion.div variants={itemVariants} className="md:col-span-2">
            <StoryCard post={posts[0]} size="feature" />
          </motion.div>
          
          <motion.div variants={itemVariants} className="grid gap-6">
            {posts.slice(1, 4).map((post) => (
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
