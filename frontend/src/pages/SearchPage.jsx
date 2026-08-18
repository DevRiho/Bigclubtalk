import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { postService } from "../services/postService";
import { sortByNewest } from "../utils/postUtils";
import { StoryCard } from "../components/blog/StoryCard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonStoryCard } from "../components/common/Skeleton";
import { SEO } from "../components/common/SEO";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || params.get("club") || "";
  const results = useQuery({ queryKey: ["search", q], queryFn: () => postService.list({ q }), enabled: Boolean(q) });

  const isLoading = results.isLoading && results.isFetching;
  const searchPosts = sortByNewest(results.data?.data || []);

  function onSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setParams({ q: form.get("q") });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <SEO 
        title={q ? `Search: ${q}` : "Search Stories"} 
        description="Search Big Club Talk football news database for latest stories, transfers, match reviews, and fan commentary." 
      />
      <h1 className="font-headline text-6xl font-black uppercase text-brand-ink dark:text-slate-100">Search Big Club Talk</h1>
      <form onSubmit={onSubmit} className="mt-6 flex max-w-2xl gap-3">
        <Input name="q" defaultValue={q} placeholder="Search title, tag, category, author..." />
        <Button type="submit">
          <Search size={16} />
          Search
        </Button>
      </form>
      
      {isLoading ? (
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <SkeletonStoryCard />
          <SkeletonStoryCard />
          <SkeletonStoryCard />
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {searchPosts.map((post) => (
              <StoryCard key={post._id} post={post} />
            ))}
          </div>
          {q && !results.isLoading && !searchPosts.length && (
            <div className="mt-8"><EmptyState title="No results found" /></div>
          )}
        </>
      )}
    </main>
  );
}

