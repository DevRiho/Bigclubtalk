import { Plus, Edit2, Trash2 } from "lucide-react";
import { sortByNewest } from "../../utils/postUtils";

export function PostsTab({ 
  adminPosts, 
  loadingPosts, 
  handleOpenEditor, 
  togglePostStatusMutation, 
  togglePostFeaturedMutation, 
  deletePostMutation, 
  isAdmin, 
  postSearch, 
  setPostSearch 
}) {
  const sortedAdminPosts = sortByNewest(adminPosts || []);
  const filteredPosts = sortedAdminPosts.filter(p => 
    p.title?.toLowerCase().includes(postSearch.toLowerCase()) ||
    p.slug?.toLowerCase().includes(postSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="font-headline text-2xl font-black uppercase text-brand-ink dark:text-slate-100">Editorial Desk</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Publish, feature, or remove editorial articles.</p>
        </div>
        <button
          onClick={() => handleOpenEditor()}
          className="flex items-center justify-center gap-2 bg-brand-red px-6 py-3 font-headline text-base font-bold uppercase tracking-wider text-white hover:bg-brand-ink dark:hover:bg-slate-800 transition rounded-sm"
        >
          <Plus className="h-5 w-5" /> Write Story
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <input
          type="text"
          placeholder="Search articles by title, slug..."
          value={postSearch}
          onChange={(e) => setPostSearch(e.target.value)}
          className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-slate-100 p-2.5 text-sm focus:border-brand-blue focus:outline-none rounded-sm"
        />
      </div>

      {/* List posts Table */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden rounded-sm">
        {loadingPosts ? (
          <div className="text-center py-10 font-bold text-slate-500 dark:text-slate-400">Loading articles...</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Author</th>
                    {isAdmin && <th className="p-4">Flags</th>}
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5} className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        No articles found.
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="p-4">
                          <div className="font-headline text-base font-bold uppercase text-brand-ink dark:text-slate-200">
                            {post.title}
                          </div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">/{post.slug}</div>
                        </td>
                        <td className="p-4">
                          <span 
                            className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border text-white rounded-sm"
                            style={{ backgroundColor: post.category?.color || "#E10600", borderColor: post.category?.color || "#E10600" }}
                          >
                            {post.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-350 font-semibold">{post.author?.name || "Unknown"}</td>
                        {isAdmin && (
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => togglePostFeaturedMutation.mutate({ id: post._id, featured: !post.featured })}
                                className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-sm text-left flex items-center gap-1 border transition-colors ${
                                  post.featured 
                                    ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-400" 
                                    : "bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                                }`}
                              >
                                ⭐ Featured: {post.featured ? "YES" : "NO"}
                              </button>
                            </div>
                          </td>
                        )}
                        <td className="p-4">
                          <select
                            value={post.status}
                            onChange={(e) => togglePostStatusMutation.mutate({ id: post._id, status: e.target.value })}
                            className={`text-xs font-bold uppercase tracking-wider p-1.5 rounded-sm border dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:border-brand-blue ${
                              post.status === "published" 
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900" 
                                : post.status === "archived" 
                                ? "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" 
                                : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900"
                            }`}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditor(post)}
                              className="p-1 text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                              title="Edit article"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to permanently delete this post?")) {
                                  deletePostMutation.mutate(post._id);
                                }
                              }}
                              className="p-1 text-slate-500 dark:text-slate-400 hover:text-brand-red dark:hover:text-brand-red hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                              title="Delete article"
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

            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredPosts.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  No articles found.
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post._id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-headline text-base font-bold uppercase text-brand-ink dark:text-slate-200">
                          {post.title}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">/{post.slug}</div>
                      </div>
                      <span 
                        className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border text-white rounded-sm shrink-0"
                        style={{ backgroundColor: post.category?.color || "#E10600", borderColor: post.category?.color || "#E10600" }}
                      >
                        {post.category?.name || "Uncategorized"}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500 justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-sm">
                      <span className="dark:text-slate-400">By {post.author?.name || "Unknown"}</span>
                      {isAdmin && (
                        <button
                          onClick={() => togglePostFeaturedMutation.mutate({ id: post._id, featured: !post.featured })}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-1 border transition-colors ${
                            post.featured 
                              ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-905 dark:text-amber-400" 
                              : "bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                          }`}
                        >
                          ⭐ Featured: {post.featured ? "YES" : "NO"}
                        </button>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                      <select
                        value={post.status}
                        onChange={(e) => togglePostStatusMutation.mutate({ id: post._id, status: e.target.value })}
                        className={`text-xs font-bold uppercase tracking-wider p-1 rounded-sm border dark:border-slate-700 dark:bg-slate-900 focus:outline-none ${
                          post.status === "published" 
                            ? "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900" 
                            : post.status === "archived" 
                            ? "bg-slate-250 text-slate-700 dark:bg-slate-800 dark:text-slate-400" 
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400"
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditor(post)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-sm flex items-center gap-1 text-xs"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to permanently delete this post?")) {
                              deletePostMutation.mutate(post._id);
                            }
                          }}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-brand-red hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-sm flex items-center gap-1 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
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
