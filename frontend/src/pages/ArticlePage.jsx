import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { postService } from "../services/postService";
import { FALLBACK_SPORTS_IMAGE } from "../constants/brand";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/common/EmptyState";

export function ArticlePage() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { data: post, isLoading } = useQuery({ queryKey: ["post", slug], queryFn: () => postService.bySlug(slug) });
  const like = useMutation({ mutationFn: () => postService.like(post._id) });
  const bookmark = useMutation({ mutationFn: () => postService.bookmark(post._id) });

  const comments = useQuery({
    queryKey: ["comments", post?._id],
    queryFn: () => postService.comments(post._id),
    enabled: Boolean(post?._id)
  });

  if (isLoading) return <main className="mx-auto max-w-4xl px-4 py-16">Loading story...</main>;
  if (!post) return <main className="mx-auto max-w-4xl px-4 py-16"><EmptyState title="Story not found" /></main>;

  return (
    <main>
      <article className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-xs font-black uppercase text-brand-red">{post.category?.name}</p>
        <h1 className="mt-3 font-headline text-5xl font-black uppercase leading-none text-brand-ink md:text-7xl">{post.title}</h1>
        <p className="mt-5 max-w-3xl text-xl leading-8 text-slate-600">{post.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase text-slate-500">
          <span>{post.author?.name}</span>
          <span>{post.readingTime} min read</span>
          {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
        </div>
        <img src={post.coverImage?.url || FALLBACK_SPORTS_IMAGE} alt={post.coverImage?.alt || post.title} className="mt-8 h-[520px] w-full object-cover" />
        <div className="my-8 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => like.mutate()}>
            <Heart size={16} /> Like
          </Button>
          <Button variant="outline" onClick={() => bookmark.mutate()}>
            <Bookmark size={16} /> Bookmark
          </Button>
          <Button variant="outline" onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}>
            <Share2 size={16} /> Share
          </Button>
        </div>
        <div className="story-body" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="font-headline text-4xl font-black uppercase text-brand-ink">
          <MessageCircle className="mr-2 inline" /> Comments
        </h2>
        <div className="mt-6 grid gap-4">
          {(comments.data || []).map((comment) => (
            <div key={comment._id} className="border border-slate-200 p-4">
              <p className="text-sm font-bold">{comment.author?.name}</p>
              <p className="mt-2 text-slate-700">{comment.content}</p>
            </div>
          ))}
          {!comments.data?.length && <EmptyState title="No comments yet" message="Be the first voice in this thread after signing in." />}
        </div>
      </section>
    </main>
  );
}
