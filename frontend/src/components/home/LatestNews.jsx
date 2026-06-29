import { StoryCard } from "../blog/StoryCard";
import { SectionHeader } from "../ui/SectionHeader";
import { EmptyState } from "../common/EmptyState";

export function LatestNews({ posts = [] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader eyebrow="Fresh from the desk" title="Latest News" />
      {posts.length ? (
        <div className="grid gap-x-8 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StoryCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
