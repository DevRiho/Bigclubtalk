import { motion } from "framer-motion";
import { StoryCard } from "../blog/StoryCard";
import { SectionHeader } from "../ui/SectionHeader";
import { EmptyState } from "../common/EmptyState";

export function LatestNews({ posts = [] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeader eyebrow="Fresh from the desk" title="Latest News" />
      {posts.length ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.div key={post._id} variants={itemVariants}>
              <StoryCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
