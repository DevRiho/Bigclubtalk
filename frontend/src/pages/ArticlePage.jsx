import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { postService } from "../services/postService";
import { FALLBACK_SPORTS_IMAGE } from "../constants/brand";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonArticle } from "../components/common/Skeleton";
import { parseMarkdownToHtml } from "../utils/markdown";
import { useAuth } from "../context/AuthContext";

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

  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");

  const addComment = useMutation({
    mutationFn: (content) => postService.addComment(post._id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
      setCommentText("");
      setCommentError("");
    },
    onError: (err) => {
      setCommentError(err.response?.data?.message || "Failed to submit comment");
    }
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment.mutate(commentText);
  };

  if (isLoading) return <SkeletonArticle />;
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
        <div className="story-body" dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(post.content) }} />
      </article>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="font-headline text-4xl font-black uppercase text-brand-ink">
          <MessageCircle className="mr-2 inline" /> Comments
        </h2>
        
        {/* Comment submission form or Login CTA */}
        <div className="mt-6 border border-slate-200 bg-slate-50 p-6 rounded mb-8">
          {user ? (
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-brand-ink text-white font-bold text-xs uppercase flex items-center justify-center">
                  {user.name ? user.name.split(" ").map(n => n[0]).join("") : "U"}
                </div>
                <div>
                  <span className="text-sm font-bold block">{user.name}</span>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Join the discussion</span>
                </div>
              </div>
              <textarea
                rows="4"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on this story..."
                maxLength="1200"
                className="w-full border border-slate-200 p-3 text-sm focus:border-brand-blue focus:ring-0 focus:outline-none bg-white rounded font-sans"
                required
              />
              {commentError && <p className="text-xs font-bold text-brand-red uppercase">{commentError}</p>}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">{commentText.length}/1200 chars</span>
                <Button 
                  type="submit" 
                  disabled={addComment.isPending || !commentText.trim()}
                  className="bg-brand-ink border-brand-ink text-white font-headline text-sm font-bold uppercase tracking-wider px-6 py-2.5 hover:bg-white hover:text-brand-ink border-2"
                >
                  {addComment.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-600 font-medium">Want to share your thoughts on this story?</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-bold">Sign in or register an account to post a comment.</p>
              <a 
                href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                className="mt-4 inline-block bg-brand-ink border-2 border-brand-ink text-white font-headline text-sm font-bold uppercase tracking-wider px-6 py-2.5 hover:bg-white hover:text-brand-ink transition"
              >
                Sign In
              </a>
            </div>
          )}
        </div>

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
