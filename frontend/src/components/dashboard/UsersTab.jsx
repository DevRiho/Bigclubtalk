import { Check } from "lucide-react";

export function UsersTab({ 
  adminUsers, 
  loadingUsers, 
  updateUserRoleMutation, 
  updateUserStatusMutation, 
  userSearch, 
  setUserSearch,
  currentUserEmail 
}) {
  const filteredUsers = adminUsers?.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline text-2xl font-black uppercase text-brand-ink dark:text-slate-100">User Credentials & Roles</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure dashboard accessibility roles and toggle user suspension states.</p>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <input
          type="text"
          placeholder="Search users by name, email..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-slate-100 p-2.5 text-sm focus:border-brand-blue focus:outline-none rounded-sm"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden rounded-sm">
        {loadingUsers ? (
          <div className="text-center py-10 font-bold text-slate-500 dark:text-slate-400">Loading user list...</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">Access Role</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((usr) => {
                      const isSelfOrRoot = usr.email === currentUserEmail || usr.email === "admin@bigclubtalk.com";
                      return (
                        <tr key={usr._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="p-4 font-bold text-brand-ink dark:text-slate-200">{usr.name}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{usr.email}</td>
                          <td className="p-4">
                            {usr.isEmailVerified ? (
                              <span className="text-xs text-green-700 dark:text-green-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                <Check className="h-4 w-4" /> Verified
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <select
                              disabled={isSelfOrRoot}
                              value={usr.role}
                              onChange={(e) => updateUserRoleMutation.mutate({ id: usr._id, role: e.target.value })}
                              className="text-xs font-bold uppercase p-1.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 rounded-sm focus:border-brand-blue disabled:opacity-60"
                            >
                              <option value="user">User / Reader</option>
                              <option value="author">Author / Writer</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <button
                              disabled={isSelfOrRoot}
                              onClick={() => updateUserStatusMutation.mutate({ id: usr._id, status: usr.status === "active" ? "suspended" : "active" })}
                              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 border rounded-sm transition-all disabled:opacity-60 ${
                                usr.status === "active" 
                                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-105 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900" 
                                  : "bg-red-50 text-red-700 border-red-200 hover:bg-red-105 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
                              }`}
                            >
                              {usr.status === "active" ? "Active" : "Suspended"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  No users found.
                </div>
              ) : (
                filteredUsers.map((usr) => {
                  const isSelfOrRoot = usr.email === currentUserEmail || usr.email === "admin@bigclubtalk.com";
                  return (
                    <div key={usr._id} className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-brand-ink dark:text-slate-200 text-base">{usr.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{usr.email}</div>
                        </div>
                        {usr.isEmailVerified ? (
                          <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 dark:text-green-400 dark:bg-green-950/20 dark:border-green-900 px-2 py-0.5 font-bold uppercase tracking-wider rounded-sm">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 font-bold uppercase tracking-wider rounded-sm dark:bg-slate-800 dark:border-slate-700">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase">Access Role</span>
                          <select
                            disabled={isSelfOrRoot}
                            value={usr.role}
                            onChange={(e) => updateUserRoleMutation.mutate({ id: usr._id, role: e.target.value })}
                            className="text-xs font-bold uppercase p-1.5 border border-slate-200 dark:border-slate-750 dark:bg-slate-900 dark:text-slate-200 rounded-sm"
                          >
                            <option value="user">User / Reader</option>
                            <option value="author">Author / Writer</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1 items-end">
                          <span className="text-[9px] font-black text-slate-400 uppercase">Status</span>
                          <button
                            disabled={isSelfOrRoot}
                            onClick={() => updateUserStatusMutation.mutate({ id: usr._id, status: usr.status === "active" ? "suspended" : "active" })}
                            className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm border transition ${
                              usr.status === "active" 
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900" 
                                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
                            }`}
                          >
                            {usr.status === "active" ? "Active" : "Suspended"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
