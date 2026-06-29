import { SectionHeader } from "../ui/SectionHeader";

export function FeaturedWriters({ authors = [] }) {
  return (
    <section className="bg-brand-ink py-12 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader eyebrow="Voices" title="Featured Writers" />
        <div className="grid gap-5 md:grid-cols-3">
          {authors.length ? (
            authors.slice(0, 3).map((author) => (
              <article key={author._id} className="border border-white/15 bg-white/5 p-6">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-white/10">
                  {author.avatar?.url && <img src={author.avatar.url} alt={author.name} className="h-full w-full object-cover" />}
                </div>
                <h3 className="mt-5 font-headline text-3xl font-black uppercase">{author.name}</h3>
                <p className="mt-1 text-sm font-bold uppercase text-brand-gold">{author.title || "Big Club Talk Writer"}</p>
                <p className="mt-3 text-sm leading-6 text-white/75">{author.bio || "Reporting across football culture, transfers, tactics, and fan conversation."}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-white/70">Author profiles will appear here after newsroom users are assigned author roles.</p>
          )}
        </div>
      </div>
    </section>
  );
}
