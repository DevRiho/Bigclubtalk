import { ArrowRightLeft, BadgeCheck, Radio } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

export function TransferCentre({ posts = [] }) {
  const transferPosts = posts.filter((post) => post.tags?.includes("transfer") || post.category?.slug === "transfers").slice(0, 5);

  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader eyebrow="Market watch" title="Transfer Centre" />
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
          {["Latest Transfers", "Rumours", "Confirmed Deals"].map((title, index) => (
            <div key={title} className="border border-slate-200 bg-white p-5">
              <div className="mb-5 flex items-center gap-3">
                {index === 0 && <ArrowRightLeft className="text-brand-blue" />}
                {index === 1 && <Radio className="text-brand-gold" />}
                {index === 2 && <BadgeCheck className="text-brand-green" />}
                <h3 className="font-headline text-2xl font-black uppercase">{title}</h3>
              </div>
              <div className="grid gap-4">
                {(transferPosts.length ? transferPosts : []).map((post) => (
                  <a key={`${title}-${post._id}`} href={`/article/${post.slug}`} className="border-t border-slate-200 pt-4">
                    <p className="text-sm font-extrabold leading-5 text-brand-ink hover:text-brand-red">{post.title}</p>
                    <p className="mt-1 text-xs font-bold uppercase text-slate-500">{post.author?.name || "Newsroom"}</p>
                  </a>
                ))}
                {!transferPosts.length && <p className="text-sm text-slate-500">Transfer stories tagged by editors will appear here.</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
