import { X, Upload, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function PostEditorForm({
  editingPost,
  handleCloseEditor,
  handleSavePost,
  editorError,
  postTitle,
  setPostTitle,
  postSlug,
  setPostSlug,
  postExcerpt,
  setPostExcerpt,
  postContent,
  setPostContent,
  postCategory,
  setPostCategory,
  postTags,
  setPostTags,
  postStatus,
  setPostStatus,
  postFeatured,
  setPostFeatured,
  postBreaking,
  setPostBreaking,
  postCoverUrl,
  setPostCoverUrl,
  postCoverAlt,
  setPostCoverAlt,
  uploadingCover,
  handleCoverImageUpload,
  uploadingBody,
  handleBodyImageUpload,
  categories
}) {
  return (
    <section className="mt-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-sm shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="font-headline text-3xl font-black uppercase text-brand-ink dark:text-slate-100">
          {editingPost === "create" ? "Write New Article" : "Edit Article"}
        </h2>
        <button 
          onClick={handleCloseEditor}
          className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-brand-ink dark:hover:text-slate-100 transition"
          aria-label="Close editor"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSavePost} className="mt-6 space-y-6">
        {editorError && (
          <div className="border-l-4 border-brand-red bg-red-50 dark:bg-red-950/20 p-4 text-xs font-bold uppercase tracking-wider text-brand-red">
            {editorError}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Fields */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Title (8-160 chars) *</label>
              <input
                type="text"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Enter post title..."
                className="mt-2 w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 font-headline text-2xl font-bold uppercase text-brand-ink dark:text-slate-100 focus:border-brand-blue focus:ring-0 focus:outline-none rounded-sm transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Slug (Optional, auto-generated)</label>
              <Input
                type="text"
                value={postSlug}
                onChange={(e) => setPostSlug(e.target.value)}
                placeholder="e.g. my-awesome-football-post"
                className="mt-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Excerpt (Short pitch, 20-300 chars) *</label>
              <textarea
                required
                rows="3"
                value={postExcerpt}
                onChange={(e) => setPostExcerpt(e.target.value)}
                placeholder="Provide a hooks-driven summary of the story..."
                className="mt-2 w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-slate-100 p-3 text-sm focus:border-brand-blue focus:ring-0 focus:outline-none rounded-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Body Content (HTML/Markdown, Min 50 chars) *</label>
              <textarea
                id="postContentTextarea"
                required
                rows="12"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Start typing the article body content..."
                className="mt-2 w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 dark:text-slate-100 p-3 font-serif text-base focus:border-brand-blue focus:ring-0 focus:outline-none rounded-sm"
              />
              <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-200 dark:border-slate-800 rounded-sm">
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Insert Image in Body</span>
                  <p className="text-xs text-slate-500 mt-0.5">Upload an image to insert it at your cursor position.</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-350 dark:border-slate-750 text-xs font-bold uppercase tracking-wider text-brand-ink dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition select-none rounded-sm">
                    <Upload className="h-3.5 w-3.5 text-slate-500" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBodyImageUpload}
                      className="hidden"
                      disabled={uploadingBody}
                    />
                  </label>
                  {uploadingBody && <span className="text-xs text-slate-500 animate-pulse uppercase font-bold tracking-wider">Uploading...</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6 border-t border-slate-200 dark:border-slate-800 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Category *</label>
              <select
                required
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="mt-2 w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 text-sm focus:border-brand-blue focus:ring-0 focus:outline-none font-medium dark:text-slate-200 rounded-sm"
              >
                <option value="" disabled>Select category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Tags (Comma separated)</label>
              <Input
                type="text"
                value={postTags}
                onChange={(e) => setPostTags(e.target.value)}
                placeholder="e.g. transfers, arsenal, premier-league"
                className="mt-2 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Status</label>
              <select
                value={postStatus}
                onChange={(e) => setPostStatus(e.target.value)}
                className="mt-2 w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 text-sm focus:border-brand-blue focus:ring-0 focus:outline-none font-bold text-brand-ink dark:text-slate-200 rounded-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cover Image *</label>
              {postCoverUrl ? (
                <div className="relative border border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-950 rounded-sm">
                  <img 
                    src={postCoverUrl} 
                    alt={postCoverAlt || "Cover Preview"} 
                    className="w-full h-48 object-cover rounded-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPostCoverUrl("");
                      setPostCoverAlt("");
                    }}
                    className="absolute top-4 right-4 bg-brand-red text-white p-2 rounded-full hover:bg-red-700 shadow-md transition flex items-center justify-center border border-white dark:border-slate-800"
                    title="Remove Image"
                  >
                    <X className="h-4 w-4 font-bold" />
                  </button>
                  <div className="mt-2 text-xs text-slate-500 truncate">
                    File: {postCoverUrl}
                  </div>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer rounded-sm transition ${uploadingCover ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-slate-400 dark:text-slate-600 mb-2" />
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                      {uploadingCover ? "Uploading Image..." : "Upload Cover Image"}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                      Select local image file
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Cover Image Alt Description</label>
              <Input
                type="text"
                value={postCoverAlt}
                onChange={(e) => setPostCoverAlt(e.target.value)}
                placeholder="Describe the cover image details..."
                className="mt-2"
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={postFeatured}
                  onChange={(e) => setPostFeatured(e.target.checked)}
                  className="rounded-sm border-slate-350 dark:border-slate-700 text-brand-red focus:ring-brand-red text-sm"
                />
                <span className="text-xs font-black uppercase text-brand-ink dark:text-slate-300 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-brand-gold fill-current" /> Feature on Hero
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={postBreaking}
                  onChange={(e) => setPostBreaking(e.target.checked)}
                  className="rounded-sm border-slate-350 dark:border-slate-700 text-brand-red focus:ring-brand-red text-sm"
                />
                <span className="text-xs font-black uppercase text-brand-ink dark:text-slate-300">
                  ⚡ Breaking News
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-6">
          <button
            type="button"
            onClick={handleCloseEditor}
            className="border border-slate-200 dark:border-slate-800 rounded-sm px-6 py-3 font-headline text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800/80"
          >
            Cancel
          </button>
          <Button
            type="submit"
            className="px-8"
          >
            Save Article
          </Button>
        </div>
      </form>
    </section>
  );
}
