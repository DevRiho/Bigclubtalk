import { FEATURED_CLUBS } from "../../constants/brand";
import { SectionHeader } from "../ui/SectionHeader";

export function ClubRail() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader eyebrow="Follow the giants" title="Featured Clubs" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {FEATURED_CLUBS.map((club, index) => (
          <a key={club} href={`/search?club=${encodeURIComponent(club)}`} className="group border border-slate-200 bg-white p-5 hover:border-brand-red">
            <span className="text-xs font-black uppercase text-slate-400">0{index + 1}</span>
            <p className="mt-8 font-headline text-2xl font-black uppercase leading-none text-brand-ink group-hover:text-brand-red">{club}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
