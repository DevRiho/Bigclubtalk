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
import { SEO } from "../components/common/SEO";

export function ArticlePage() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { data: post, isLoading } = useQuery({ queryKey: ["post", slug], queryFn: () => postService.bySlug(slug) });
  const like = useMutation({
    mutationFn: () => postService.like(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["post", slug]);
    }
  });

  const bookmark = useMutation({
    mutationFn: () => postService.bookmark(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["post", slug]);
    }
  });

  const handleLike = () => {
    if (!user) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    like.mutate();
  };

  const handleBookmark = () => {
    if (!user) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    bookmark.mutate();
  };

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
      <SEO 
        title={post.title}
        description={post.excerpt}
        image={post.coverImage?.url || FALLBACK_SPORTS_IMAGE}
        type="article"
        articleData={{
          publishedAt: post.publishedAt || post.createdAt,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          authorName: post.author?.name
        }}
      />
      
      <article className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-xs font-black uppercase text-brand-red tracking-wider">{post.category?.name}</p>
        <h1 className="mt-3 font-headline text-5xl font-black uppercase leading-none text-brand-ink dark:text-slate-100 md:text-7xl">{post.title}</h1>
        <p className="mt-5 max-w-3xl text-xl leading-relaxed text-slate-600 dark:text-slate-400">{post.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
          <span className="text-slate-700 dark:text-slate-200">{post.author?.name}</span>
          <span>&bull;</span>
          <span>{post.readingTime} min read</span>
          {post.publishedAt && (
            <>
              <span>&bull;</span>
              <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </>
          )}
        </div>
        
        <div className="mt-8 overflow-hidden rounded-sm aspect-[21/9]">
          <img src={post.coverImage?.url || FALLBACK_SPORTS_IMAGE} alt={post.coverImage?.alt || post.title} className="h-full w-full object-cover" />
        </div>

        <div className="my-8 flex flex-wrap gap-3 font-sans">
          <Button 
            onClick={handleLike}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm font-headline text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              post.isLiked 
                ? "bg-red-50 dark:bg-red-950/20 text-brand-red border border-brand-red hover:bg-red-100 dark:hover:bg-red-900/30" 
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80"
            }`}
          >
            <Heart size={15} className={post.isLiked ? "fill-brand-red text-brand-red" : "text-slate-500"} /> 
            {post.isLiked ? "Liked" : "Like"} ({post.likesCount || 0})
          </Button>

          <Button 
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm font-headline text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              post.isBookmarked 
                ? "bg-blue-50 dark:bg-blue-950/20 text-brand-blue border border-brand-blue hover:bg-blue-100 dark:hover:bg-blue-900/30" 
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80"
            }`}
          >
            <Bookmark size={15} className={post.isBookmarked ? "fill-brand-blue text-brand-blue" : "text-slate-500"} /> 
            {post.isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>

          <Button 
            variant="outline" 
            onClick={() => navigator.share?.({ title: post.title, url: window.location.href }) || navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied to clipboard!"))}
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm font-headline text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 bg-white dark:bg-slate-900"
          >
            <Share2 size={15} className="text-slate-500" /> Share
          </Button>
        </div>

        <div className="story-body" dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(post.content) }} />
      </article>

      <section className="mx-auto max-w-4xl px-4 py-12 border-t border-slate-100 dark:border-slate-900">
        <h2 className="font-headline text-3xl font-black uppercase text-brand-ink dark:text-slate-100 flex items-center">
          <MessageCircle className="mr-3 text-brand-red" size={24} /> Comments
        </h2>
        
        {/* Comment submission form or Login CTA */}
        <div className="mt-6 border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-sm mb-8 transition-colors duration-200">
          {user ? (
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-ink dark:bg-slate-800 text-white font-bold text-xs uppercase flex items-center justify-center">
                  {user.name ? user.name.split(" ").map(n => n[0]).join("") : "U"}
                </div>
                <div>
                  <span className="text-sm font-black block dark:text-slate-100">{user.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Join the discussion</span>
                </div>
              </div>
              <textarea
                rows="4"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on this story..."
                maxLength="1200"
                className="w-full border border-slate-200 dark:border-slate-800 p-3 text-sm focus:border-brand-blue focus:ring-0 focus:outline-none bg-white dark:bg-slate-950 dark:text-slate-100 rounded-sm font-sans"
                required
              />
              {commentError && <p className="text-xs font-bold text-brand-red uppercase">{commentError}</p>}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">{commentText.length}/1200 chars</span>
                <Button 
                  type="submit" 
                  disabled={addComment.isPending || !commentText.trim()}
                  className="bg-brand-ink dark:bg-slate-800 border-brand-ink dark:border-slate-850 text-white font-headline text-xs font-black uppercase tracking-wider px-6 py-2.5 hover:bg-brand-red dark:hover:bg-brand-red"
                >
                  {addComment.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-700 dark:text-slate-300 font-bold">Want to share your thoughts on this story?</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 uppercase font-bold tracking-wider">Sign in or register an account to post a comment.</p>
              <a 
                href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                className="mt-5 inline-block bg-brand-ink dark:bg-slate-850 text-white font-headline text-xs font-black uppercase tracking-widest px-8 py-3 hover:bg-brand-red dark:hover:bg-brand-red transition rounded-sm"
              >
                Sign In
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4">
          {comments.data?.length ? (
            comments.data.map((comment) => (
              <div key={comment._id} className="border border-slate-100 dark:border-slate-850 bg-white/40 dark:bg-slate-900/20 p-4 rounded-sm">
                <p className="text-xs font-black uppercase tracking-wider text-brand-ink dark:text-slate-200">{comment.author?.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-350">{comment.content}</p>
              </div>
            ))
          ) : (
            <EmptyState title="No comments yet" message="Be the first voice in this thread after signing in." />
          )}
        </div>
      </section>
    </main>
  );
}
