import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { postService } from "../services/postService";
import { StoryCard } from "../components/blog/StoryCard";
import { EmptyState } from "../components/common/EmptyState";

export function CategoryPage() {
  const { slug } = useParams();
  const posts = useQuery({ queryKey: ["category", slug], queryFn: () => postService.list({ q: slug.replaceAll("-", " ") }) });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-headline text-6xl font-black uppercase text-brand-ink">{slug.replaceAll("-", " ")}</h1>
      <div className="mt-10 grid gap-7 md:grid-cols-3">
        {(posts.data?.data || []).map((post) => (
          <StoryCard key={post._id} post={post} />
        ))}
      </div>
      {!posts.data?.data?.length && <div className="mt-8"><EmptyState /></div>}
    </main>
  );
}
