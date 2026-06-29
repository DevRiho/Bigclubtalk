import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { postService } from "../services/postService";
import { StoryCard } from "../components/blog/StoryCard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/common/EmptyState";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || params.get("club") || "";
  const results = useQuery({ queryKey: ["search", q], queryFn: () => postService.list({ q }), enabled: Boolean(q) });

  function onSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setParams({ q: form.get("q") });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-headline text-6xl font-black uppercase text-brand-ink">Search Big Club Talk</h1>
      <form onSubmit={onSubmit} className="mt-6 flex max-w-2xl gap-3">
        <Input name="q" defaultValue={q} placeholder="Search title, tag, category, author..." />
        <Button type="submit">
          <Search size={16} />
          Search
        </Button>
      </form>
      <div className="mt-10 grid gap-7 md:grid-cols-3">
        {(results.data?.data || []).map((post) => (
          <StoryCard key={post._id} post={post} />
        ))}
      </div>
      {q && !results.data?.data?.length && <div className="mt-8"><EmptyState title="No results found" /></div>}
    </main>
  );
}
