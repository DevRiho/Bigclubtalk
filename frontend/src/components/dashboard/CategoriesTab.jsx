import { Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function CategoriesTab({ 
  categories, 
  loadingCategories, 
  createCategoryMutation, 
  deleteCategoryMutation, 
  catName, 
  setCatName, 
  catSlug, 
  setCatSlug, 
  catColor, 
  setCatColor, 
  catError 
}) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Category List */}
      <div className="md:col-span-2 space-y-4">
        <div>
          <h3 className="font-headline text-2xl font-black uppercase text-brand-ink dark:text-slate-100">Topics & Categories</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage tags and global article categorization rules.</p>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden rounded-sm">
          {loadingCategories ? (
            <div className="text-center py-10 font-bold text-slate-500 dark:text-slate-400">Loading categories...</div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <th className="p-4">Category Name</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Color Badge</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                    {categories?.map((cat) => (
                      <tr key={cat._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="p-4 font-headline text-lg font-bold uppercase text-brand-ink dark:text-slate-200">{cat.name}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-450">/{cat.slug}</td>
                        <td className="p-4">
                          <span 
                            className="inline-block w-6 h-6 rounded border border-slate-200 dark:border-slate-800 shadow-sm"
                            style={{ backgroundColor: cat.color }}
                          />
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete Category "${cat.name}"?`)) {
                                deleteCategoryMutation.mutate(cat._id);
                              }
                            }}
                            className="text-slate-400 hover:text-brand-red transition p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {categories?.map((cat) => (
                  <div key={cat._id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span 
                        className="w-6 h-6 rounded border border-slate-200 dark:border-slate-800 shadow-sm shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <div>
                        <div className="font-headline text-base font-bold uppercase text-brand-ink dark:text-slate-200">{cat.name}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">/{cat.slug}</div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete Category "${cat.name}"?`)) {
                          deleteCategoryMutation.mutate(cat._id);
                        }
                      }}
                      className="text-slate-400 hover:text-brand-red transition p-2 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {(!categories || categories.length === 0) && (
                  <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No categories found.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Category Form */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 h-fit rounded-sm shadow-sm">
        <h4 className="font-headline text-xl font-black uppercase text-brand-ink dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">Add Category</h4>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!catName.trim()) return;
            createCategoryMutation.mutate({
              name: catName,
              slug: catSlug || undefined,
              color: catColor
            });
          }}
          className="mt-4 space-y-4"
        >
          {catError && (
            <div className="text-xs text-brand-red font-semibold uppercase">{catError}</div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Name *</label>
            <Input
              type="text"
              required
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Transfers"
              className="mt-1.5 h-10 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Slug (Optional)</label>
            <Input
              type="text"
              value={catSlug}
              onChange={(e) => setCatSlug(e.target.value)}
              placeholder="e.g. transfers"
              className="mt-1.5 h-10 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Theme Color</label>
            <div className="flex flex-wrap gap-2">
              {["#E10600", "#0057FF", "#FFB000", "#00875A", "#101820"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCatColor(c)}
                  className={`w-7 h-7 rounded-sm border transition-all ${
                    catColor === c ? "ring-2 ring-brand-blue dark:ring-brand-gold ring-offset-2 scale-110" : "border-slate-200 dark:border-slate-800"
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
            <Input
              type="text"
              value={catColor}
              onChange={(e) => setCatColor(e.target.value)}
              className="mt-3 h-8 text-xs font-mono"
              placeholder="#Hex color code"
            />
          </div>

          <Button
            type="submit"
            disabled={createCategoryMutation.isPending}
            className="w-full h-10 text-xs font-black"
          >
            {createCategoryMutation.isPending ? "Saving..." : "Save Category"}
          </Button>
        </form>
      </div>
    </div>
  );
}
