import { Check, X, Trash2 } from "lucide-react";

export function CommentsTab({ 
  adminComments, 
  loadingComments, 
  toggleCommentStatusMutation, 
  deleteCommentMutation, 
  commentSearch, 
  setCommentSearch 
}) {
  const filteredComments = adminComments?.filter(c => 
    c.content?.toLowerCase().includes(commentSearch.toLowerCase()) || 
    c.author?.name?.toLowerCase().includes(commentSearch.toLowerCase()) ||
    c.author?.email?.toLowerCase().includes(commentSearch.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline text-2xl font-black uppercase text-brand-ink dark:text-slate-100">Comment Moderation</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage, hide, or delete community responses.</p>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <input
          type="text"
          placeholder="Search comment contents, authors..."
          value={commentSearch}
          onChange={(e) => setCommentSearch(e.target.value)}
          className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-slate-100 p-2.5 text-sm focus:border-brand-blue focus:outline-none rounded-sm"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden rounded-sm">
        {loadingComments ? (
          <div className="text-center py-10 font-bold text-slate-500 dark:text-slate-400">Loading comments...</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <th className="p-4">Author</th>
                    <th className="p-4">Article</th>
                    <th className="p-4">Comment Content</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                  {filteredComments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        No comments found.
                      </td>
                    </tr>
                  ) : (
                    filteredComments.map((comm) => (
                      <tr key={comm._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="p-4">
                          <div className="font-bold text-brand-ink dark:text-slate-200">{comm.author?.name}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">{comm.author?.email}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-headline text-xs font-bold uppercase truncate max-w-[150px] text-brand-ink dark:text-slate-300">
                            {comm.post?.title || "Deleted Article"}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-700 dark:text-slate-300 text-xs italic break-words max-w-[320px]">
                            &quot;{comm.content}&quot;
                          </p>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-sm ${
                            comm.status === "visible" 
                              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900" 
                              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
                          }`}>
                            {comm.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toggleCommentStatusMutation.mutate({
                                id: comm._id,
                                status: comm.status === "visible" ? "hidden" : "visible"
                              })}
                              className={`p-1.5 transition rounded border ${
                                comm.status === "visible" 
                                  ? "text-slate-400 hover:text-brand-red hover:bg-red-50 dark:hover:bg-red-950/20 border-transparent" 
                                  : "text-slate-400 hover:text-green-700 hover:bg-green-55 dark:hover:bg-green-955 border-transparent"
                              }`}
                              title={comm.status === "visible" ? "Hide comment" : "Show comment"}
                            >
                              {comm.status === "visible" ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this comment completely?")) {
                                  deleteCommentMutation.mutate(comm._id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-brand-red hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                              title="Delete completely"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredComments.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  No comments found.
                </div>
              ) : (
                filteredComments.map((comm) => (
                  <div key={comm._id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-brand-ink dark:text-slate-200">{comm.author?.name}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500">{comm.author?.email}</div>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-sm ${
                        comm.status === "visible" 
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900" 
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
                      }`}>
                        {comm.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Article: <span className="font-bold text-brand-ink dark:text-slate-350 uppercase font-headline">{comm.post?.title || "Deleted Article"}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-sm text-xs text-slate-700 dark:text-slate-300 italic border border-slate-100 dark:border-slate-800 mt-1">
                      &quot;{comm.content}&quot;
                    </div>

                    <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-105 dark:border-slate-800">
                      <button
                        onClick={() => toggleCommentStatusMutation.mutate({
                          id: comm._id,
                          status: comm.status === "visible" ? "hidden" : "visible"
                        })}
                        className={`px-3 py-1.5 text-xs font-bold rounded-sm border ${
                          comm.status === "visible" 
                            ? "text-red-700 bg-red-50 border-red-200 dark:text-red-450 dark:bg-red-950/20 dark:border-red-900" 
                            : "text-green-700 bg-green-50 border-green-200 dark:text-green-450 dark:bg-green-950/20 dark:border-green-900"
                        }`}
                      >
                        {comm.status === "visible" ? "Hide" : "Approve"}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this comment completely?")) {
                            deleteCommentMutation.mutate(comm._id);
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-bold rounded-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-red"
                      >
                        Delete
                      </button>
                    </div>
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
