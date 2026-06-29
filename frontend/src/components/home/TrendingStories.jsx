import { StoryCard } from "../blog/StoryCard";
import { SectionHeader } from "../ui/SectionHeader";
import { EmptyState } from "../common/EmptyState";

export function TrendingStories({ posts = [] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader eyebrow="Most talked about" title="Trending Stories" />
      {posts.length ? (
        <div className="grid gap-7 md:grid-cols-3">
          <div className="md:col-span-2">
            <StoryCard post={posts[0]} size="feature" />
          </div>
          <div className="grid gap-6">
            {posts.slice(1, 4).map((post) => (
              <StoryCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
