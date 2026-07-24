import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Share2, Clock, Calendar, Check } from "lucide-react";
import { FALLBACK_SPORTS_IMAGE } from "../../constants/brand";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import { postService } from "../../services/postService";
import { Button } from "../ui/Button";

export function StoryCard({ post, size = "standard" }) {
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(post?.isBookmarked || false);
  const [copied, setCopied] = useState(false);

  const image = post?.coverImage?.url || FALLBACK_SPORTS_IMAGE;
  const isFeature = size === "feature";

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login page
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    // Pessimistic state toggle, rollback on catch
    const prev = bookmarked;
    setBookmarked(!prev);
    try {
      await postService.bookmark(post._id);
    } catch {
      setBookmarked(prev);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const articleUrl = `${window.location.origin}/article/${post.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: articleUrl
        });
      } catch (err) {
        console.warn("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(articleUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  const formattedDate = post?.publishedAt || post?.createdAt
    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "";

  return (
    <article 
      className={cn(
        "group relative flex flex-col h-full border border-slate-100 bg-white/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-200 dark:border-slate-900 dark:bg-slate-900/40 dark:hover:border-slate-800 dark:hover:bg-slate-900/60 rounded-sm overflow-hidden",
        isFeature && "border-0 shadow-none hover:translate-y-0 hover:shadow-none dark:bg-transparent dark:hover:bg-transparent"
      )}
    >
      {/* IMAGE TREATMENT */}
      <Link 
        to={`/article/${post.slug}`} 
        className={cn(
          "block overflow-hidden bg-slate-100 dark:bg-slate-950 relative",
          isFeature ? "h-[320px] md:h-[480px]" : "aspect-[16/10]"
        )}
      >
        <img 
          src={image} 
          alt={post.coverImage?.alt || post.title} 
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        
        {/* Category Badge overlay on feature card */}
        {isFeature && (
          <div className="absolute left-6 bottom-6 bg-brand-red px-3 py-1 text-xs font-black uppercase text-white tracking-widest rounded-sm">
            {post.category?.name || "Featured"}
          </div>
        )}
      </Link>

      {/* BODY CONTENT */}
      <div className={cn("p-5 flex flex-col flex-grow", isFeature && "px-0 py-6 bg-transparent")}>
        {/* Category badge */}
        {!isFeature && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-brand-red tracking-wider border-l-2 border-brand-red pl-2">
              {post.category?.name || "Football"}
            </span>
            <div className="flex gap-1">
              {/* Bookmark Toggle */}
              <button 
                onClick={handleBookmark}
                className={cn(
                  "p-1.5 rounded-full text-slate-400 hover:text-brand-blue hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                  bookmarked && "text-brand-blue dark:text-brand-blue"
                )}
                aria-label="Bookmark article"
              >
                <Bookmark size={15} className={bookmarked ? "fill-brand-blue" : ""} />
              </button>
              {/* Share Trigger */}
              <button 
                onClick={handleShare}
                className="p-1.5 rounded-full text-slate-400 hover:text-brand-ink dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
                aria-label="Share article"
              >
                {copied ? <Check size={15} className="text-brand-green" /> : <Share2 size={15} />}
                
                {/* Clipboard Feedback Tooltip */}
                {copied && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[9px] font-bold text-white bg-slate-900 dark:bg-slate-800 rounded whitespace-nowrap shadow-md">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Title */}
        <Link to={`/article/${post.slug}`} className="mt-2.5 block group-hover:text-brand-red">
          <h3 
            className={cn(
              "font-headline font-black uppercase leading-tight text-brand-ink dark:text-slate-100 group-hover:text-brand-red transition-colors",
              isFeature ? "text-4xl md:text-5xl lg:text-6xl" : "text-xl md:text-2xl"
            )}
          >
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="mt-3 line-clamp-2 text-xs md:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {post.excerpt}
        </p>

        {/* Metadata info footer */}
        <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1">
            <span className="text-slate-600 dark:text-slate-300 font-extrabold">{post.author?.name || "Big Club Talk"}</span>
          </div>

          <div className="flex items-center gap-3">
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {formattedDate}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.readingTime || 1} min
            </span>
          </div>
        </div>

        {isFeature && (
          <div className="mt-4 flex gap-2">
            <Button onClick={handleBookmark} variant="outline" className="h-9 px-3 rounded-sm text-[10px]">
              <Bookmark size={13} className={bookmarked ? "fill-brand-blue text-brand-blue" : ""} />
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <Button onClick={handleShare} variant="outline" className="h-9 px-3 rounded-sm text-[10px] relative">
              {copied ? <Check size={13} className="text-brand-green" /> : <Share2 size={13} />}
              {copied ? "Copied" : "Share"}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
