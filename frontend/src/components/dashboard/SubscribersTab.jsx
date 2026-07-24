export function SubscribersTab({ subscribers, loadingSubscribers }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline text-2xl font-black uppercase text-brand-ink dark:text-slate-100">Newsletter Mailing List</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">View emails subscribed to receive updates from the newsroom.</p>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden rounded-sm">
        {loadingSubscribers ? (
          <div className="text-center py-10 font-bold text-slate-500 dark:text-slate-400">Loading subscribers...</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Subscribed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                  {subscribers?.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="p-6 text-center text-slate-400 font-medium">
                        No newsletter subscribers registered yet.
                      </td>
                    </tr>
                  ) : (
                    subscribers?.map((sub) => (
                      <tr key={sub._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="p-4 font-semibold text-brand-ink dark:text-slate-200">{sub.email}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-450">
                          {new Date(sub.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {subscribers?.length === 0 ? (
                <div className="p-6 text-center text-slate-400 font-medium">
                  No newsletter subscribers registered yet.
                </div>
              ) : (
                subscribers?.map((sub) => (
                  <div key={sub._id} className="p-4 flex justify-between items-center bg-white dark:bg-slate-900">
                    <span className="font-semibold text-brand-ink dark:text-slate-200 text-sm">{sub.email}</span>
                    <span className="text-slate-400 dark:text-slate-500 text-xs">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
