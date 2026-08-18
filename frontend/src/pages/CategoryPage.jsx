import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { postService } from "../services/postService";
import { sortByNewest } from "../utils/postUtils";
import { StoryCard } from "../components/blog/StoryCard";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonStoryCard } from "../components/common/Skeleton";
import { SEO } from "../components/common/SEO";

export function CategoryPage() {
  const { slug } = useParams();
  const posts = useQuery({ queryKey: ["category", slug], queryFn: () => postService.list({ category: slug }) });

  const isLoading = posts.isLoading;
  const categoryTitle = slug ? slug.replaceAll("-", " ") : "";
  const sortedPosts = sortByNewest(posts.data?.data || []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <SEO 
        title={categoryTitle} 
        description={`Read the latest ${categoryTitle} news, expert transfers, tactical reviews, and commentaries on Big Club Talk.`} 
      />
      <h1 className="font-headline text-6xl font-black uppercase text-brand-ink dark:text-slate-100">{categoryTitle}</h1>
      
      {isLoading ? (
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <SkeletonStoryCard />
          <SkeletonStoryCard />
          <SkeletonStoryCard />
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {sortedPosts.map((post) => (
              <StoryCard key={post._id} post={post} />
            ))}
          </div>
          {!sortedPosts.length && <div className="mt-8"><EmptyState /></div>}
        </>
      )}
    </main>
  );
}

