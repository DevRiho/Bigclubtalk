import { Link } from "react-router-dom";
import { FALLBACK_SPORTS_IMAGE } from "../../constants/brand";
import { cn } from "../../utils/cn";

export function StoryCard({ post, size = "standard" }) {
  const image = post?.coverImage?.url || FALLBACK_SPORTS_IMAGE;

  return (
    <article className={cn("group border-b border-slate-200 pb-5", size === "feature" && "border-0 pb-0")}>
      <Link to={`/article/${post.slug}`} className="block overflow-hidden bg-slate-100">
        <img src={image} alt={post.coverImage?.alt || post.title} className={cn("h-48 w-full object-cover transition duration-500 group-hover:scale-105", size === "feature" && "h-[420px]")} />
      </Link>
      <div className="mt-4">
        <p className="text-xs font-black uppercase text-brand-red">{post.category?.name || "Football"}</p>
        <Link to={`/article/${post.slug}`}>
          <h3 className={cn("mt-2 font-headline text-2xl font-black uppercase leading-tight text-brand-ink group-hover:text-brand-red", size === "feature" && "text-5xl")}>{post.title}</h3>
        </Link>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-3 text-xs font-bold uppercase text-slate-500">
          <span>{post.author?.name || "Big Club Talk"}</span>
          <span>{post.readingTime || 1} min read</span>
        </div>
      </div>
    </article>
  );
}
