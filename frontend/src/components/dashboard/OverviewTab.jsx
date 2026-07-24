import { Users, FileText, BarChart3, MessageSquare, Sparkles, Eye } from "lucide-react";

export function OverviewTab({ stats, popularArticles, loadingAnalytics }) {
  if (loadingAnalytics) {
    return <div className="text-center py-10 font-bold text-slate-500">Loading control statistics...</div>;
  }

  const overviewStats = [
    { label: "Users", value: stats.users || 0, icon: Users, styles: "bg-blue-50 text-brand-blue dark:bg-blue-950/20" },
    { label: "Posts", value: stats.posts || 0, icon: FileText, styles: "bg-red-50 text-brand-red dark:bg-red-950/20" },
    { label: "Views", value: stats.views || 0, icon: BarChart3, styles: "bg-green-50 text-brand-green dark:bg-green-950/20" },
    { label: "Comments", value: stats.comments || 0, icon: MessageSquare, styles: "bg-amber-50 text-brand-gold dark:bg-amber-950/20" },
    { label: "Likes", value: stats.likes || 0, icon: Sparkles, styles: "bg-purple-50 text-purple-600 dark:bg-purple-950/20" }
  ];

  return (
    <div className="space-y-8">
      {/* Statistics panel */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {overviewStats.map(({ label, value, icon: Icon, styles }) => (
          <div key={label} className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-5 hover:shadow-md transition">
            <div className={`inline-flex rounded-sm p-2.5 ${styles}`}>
              <Icon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
            <p className="mt-1 font-headline text-3xl font-black text-brand-ink dark:text-slate-100">{value}</p>
          </div>
        ))}
      </div>

      {/* Popular articles list */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h3 className="font-headline text-2xl font-black uppercase text-brand-ink dark:text-slate-100 flex items-center gap-2">
          🔥 Popular Stories
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">The most read and viewed articles globally.</p>

        <div className="mt-6">
          <table className="hidden md:table w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-400">
                <th className="pb-3">Title</th>
                <th className="pb-3">Published Date</th>
                <th className="pb-3 text-right">Total Reads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {popularArticles.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-sm text-slate-500 font-medium">
                    No statistics recorded yet.
                  </td>
                </tr>
              ) : (
                popularArticles.map((art) => (
                  <tr key={art._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition group">
                    <td className="py-4 pr-4">
                      <a 
                        href={`/article/${art.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-headline text-lg font-bold uppercase tracking-wide text-brand-ink dark:text-slate-200 group-hover:text-brand-red dark:group-hover:text-brand-red flex items-center gap-1.5"
                      >
                        {art.title} <Eye className="h-4 w-4 text-slate-400 inline" />
                      </a>
                    </td>
                    <td className="py-4 text-sm text-slate-600 dark:text-slate-400">
                      {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : "Unpublished"}
                    </td>
                    <td className="py-4 text-right font-headline text-xl font-bold text-brand-ink dark:text-slate-200">
                      {art.views}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="block md:hidden space-y-4">
            {popularArticles.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded">
                No statistics recorded yet.
              </div>
            ) : (
              popularArticles.map((art) => (
                <div key={art._id} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded shadow-xs flex flex-col gap-2">
                  <a 
                    href={`/article/${art.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-headline text-base font-bold uppercase tracking-wide text-brand-ink dark:text-slate-200 hover:text-brand-red flex items-center gap-1.5"
                  >
                    {art.title} <Eye className="h-4 w-4 text-slate-400 inline" />
                  </a>
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>Published: {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : "Unpublished"}</span>
                    <span className="font-bold text-brand-ink dark:text-slate-200">Reads: {art.views}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
