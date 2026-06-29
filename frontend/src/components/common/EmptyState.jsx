export function EmptyState({ title = "The newsroom is ready", message = "Published stories will appear here as soon as editors ship them." }) {
  return (
    <div className="border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="font-headline text-2xl font-bold uppercase text-brand-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">{message}</p>
    </div>
  );
}
