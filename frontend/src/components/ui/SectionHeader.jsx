export function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-3 border-t-4 border-brand-ink dark:border-slate-200 pt-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="text-xs font-black uppercase text-brand-red tracking-wider">{eyebrow}</p>}
        <h2 className="font-headline text-3xl font-black uppercase leading-none text-brand-ink dark:text-slate-100 md:text-5xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
