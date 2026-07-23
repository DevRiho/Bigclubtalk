import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, FileText, MessageSquare, Users, Plus, Trash2, 
  Check, X, Sparkles, Layers, Mail, Eye, Shield, Edit2, LogOut,
  Upload, Copy
} from "lucide-react";
import { metaService } from "../services/metaService";
import { postService } from "../services/postService";
import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState(isAdmin ? "overview" : "posts");

  // Auth check - redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // If user role changes or loads, ensure non-admins aren't stuck on overview tab
  useEffect(() => {
    if (user && user.role !== "admin" && activeTab === "overview") {
      setActiveTab("posts");
    }
  }, [user, activeTab]);

  // Tab data fetching
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: metaService.analytics,
    enabled: isAdmin
  });

  const { data: adminUsers, isLoading: loadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: metaService.adminUsers,
    enabled: isAdmin
  });

  const { data: adminPosts, isLoading: loadingPosts, refetch: refetchPosts } = useQuery({
    queryKey: ["adminPosts", isAdmin],
    queryFn: () => isAdmin ? metaService.adminPosts() : postService.list({ author: user?._id, status: "all" }).then(res => res.data),
    enabled: !!user
  });

  const { data: adminComments, isLoading: loadingComments, refetch: refetchComments } = useQuery({
    queryKey: ["adminComments"],
    queryFn: metaService.adminComments,
    enabled: isAdmin
  });

  const { data: subscribers, isLoading: loadingSubscribers, refetch: refetchSubscribers } = useQuery({
    queryKey: ["subscribers"],
    queryFn: metaService.subscribers,
    enabled: isAdmin
  });

  const { data: categories, isLoading: loadingCategories, refetch: refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: metaService.categories
  });

  // Search filter states
  const [userSearch, setUserSearch] = useState("");
  const [postSearch, setPostSearch] = useState("");
  const [commentSearch, setCommentSearch] = useState("");

  // Post Editor states
  const [editingPost, setEditingPost] = useState(null); // null, 'create', or post object
  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postTags, setPostTags] = useState("");
  const [postStatus, setPostStatus] = useState("draft");
  const [postFeatured, setPostFeatured] = useState(false);
  const [postBreaking, setPostBreaking] = useState(false);
  const [postCoverUrl, setPostCoverUrl] = useState("");
  const [postCoverAlt, setPostCoverAlt] = useState("");
  const [editorError, setEditorError] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBody, setUploadingBody] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCover(true);
    setEditorError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await postService.uploadImage(formData);
      setPostCoverUrl(res.url);
    } catch (err) {
      console.error(err);
      setEditorError("Failed to upload cover image. Please try again.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleInsertAtCursor = (textToInsert) => {
    const textarea = document.getElementById("postContentTextarea");
    if (!textarea) {
      setPostContent(prev => prev + "\n" + textToInsert);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newContent = before + textToInsert + after;
    setPostContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  const handleBodyImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBody(true);
    setEditorError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await postService.uploadImage(formData);
      setUploadedImageUrl(res.url);
      handleInsertAtCursor(`\n<img src="${res.url}" alt="image" />\n`);
    } catch (err) {
      console.error(err);
      setEditorError("Failed to upload image to body. Please try again.");
    } finally {
      setUploadingBody(false);
    }
  };

  // Category Form states
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catColor, setCatColor] = useState("#E10600");
  const [catError, setCatError] = useState("");

  // Pre-fill Editor for Create/Edit
  const handleOpenEditor = (post = null) => {
    if (post) {
      setEditingPost(post);
      setPostTitle(post.title || "");
      setPostSlug(post.slug || "");
      setPostContent(post.content || "");
      setPostExcerpt(post.excerpt || "");
      setPostCategory(post.category?._id || post.category || "");
      setPostTags(post.tags ? post.tags.join(", ") : "");
      setPostStatus(post.status || "draft");
      setPostFeatured(post.featured || false);
      setPostBreaking(post.breaking || false);
      setPostCoverUrl(post.coverImage?.url || "");
      setPostCoverAlt(post.coverImage?.alt || "");
    } else {
      setEditingPost("create");
      setPostTitle("");
      setPostSlug("");
      setPostContent("");
      setPostExcerpt("");
      setPostCategory(categories?.[0]?._id || "");
      setPostTags("");
      setPostStatus("draft");
      setPostFeatured(false);
      setPostBreaking(false);
      setPostCoverUrl("");
      setPostCoverAlt("");
    }
    setEditorError("");
  };

  // Close Editor
  const handleCloseEditor = () => {
    setEditingPost(null);
  };

  // Handle Post Save
  const handleSavePost = async (e) => {
    e.preventDefault();
    setEditorError("");

    if (postTitle.length < 8 || postTitle.length > 160) {
      setEditorError("Title must be between 8 and 160 characters");
      return;
    }
    if (postContent.length < 50) {
      setEditorError("Content must be at least 50 characters long");
      return;
    }
    if (postExcerpt.length < 20 || postExcerpt.length > 300) {
      setEditorError("Excerpt must be between 20 and 300 characters");
      return;
    }
    if (!postCategory) {
      setEditorError("Please select a category");
      return;
    }

    const payload = {
      title: postTitle,
      slug: postSlug || undefined,
      content: postContent,
      excerpt: postExcerpt,
      category: postCategory,
      tags: postTags ? postTags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [],
      status: postStatus,
      featured: postFeatured,
      breaking: postBreaking,
      coverImage: postCoverUrl ? { url: postCoverUrl, alt: postCoverAlt || postTitle } : undefined
    };

    try {
      if (editingPost === "create") {
        await postService.create(payload);
      } else {
        await postService.update(editingPost._id, payload);
      }
      queryClient.invalidateQueries(["adminPosts"]);
      queryClient.invalidateQueries(["analytics"]);
      refetchPosts();
      setEditingPost(null);
    } catch (err) {
      setEditorError(err.response?.data?.message || "Failed to save the article");
    }
  };

  // Quick Action Mutations
  const togglePostStatusMutation = useMutation({
    mutationFn: ({ id, status }) => postService.update(id, { status }),
    onSuccess: () => {
      refetchPosts();
      queryClient.invalidateQueries(["analytics"]);
    }
  });

  const togglePostFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }) => postService.update(id, { featured }),
    onSuccess: () => refetchPosts()
  });

  const deletePostMutation = useMutation({
    mutationFn: (id) => postService.delete(id),
    onSuccess: () => {
      refetchPosts();
      queryClient.invalidateQueries(["analytics"]);
    }
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ id, role }) => metaService.updateAdminUser(id, { role }),
    onSuccess: () => refetchUsers()
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ id, status }) => metaService.updateAdminUser(id, { status }),
    onSuccess: () => refetchUsers()
  });

  const createCategoryMutation = useMutation({
    mutationFn: (payload) => metaService.createCategory(payload),
    onSuccess: () => {
      refetchCategories();
      setCatName("");
      setCatSlug("");
      setCatColor("#E10600");
    },
    onError: (err) => {
      setCatError(err.response?.data?.message || "Failed to create category");
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => metaService.deleteCategory(id),
    onSuccess: () => refetchCategories()
  });

  const toggleCommentStatusMutation = useMutation({
    mutationFn: ({ id, status }) => postService.updateComment(id, { status }),
    onSuccess: () => {
      refetchComments();
      queryClient.invalidateQueries(["analytics"]);
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id) => postService.deleteComment(id),
    onSuccess: () => {
      refetchComments();
      queryClient.invalidateQueries(["analytics"]);
    }
  });

  if (!user) return null;

  const stats = analytics || { users: 0, posts: 0, comments: 0, views: 0, likes: 0 };
  const popularArticles = analytics?.popularArticles || [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col justify-between border-b border-slate-200 pb-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-brand-red">Newsroom Control Center</p>
          <h1 className="mt-1 font-headline text-5xl font-black uppercase text-brand-ink">
            {isAdmin ? "Admin Dashboard" : "Publisher Workspace"}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-brand-ink text-[10px] font-bold uppercase text-white px-2 py-0.5 tracking-wider">
              <Shield className="h-3 w-3 text-brand-gold" /> {user.role}
            </span>
            <span className="text-sm text-slate-500 font-medium">Logged in as {user.name} ({user.email})</span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="mt-4 flex items-center justify-center gap-2 border-2 border-brand-ink bg-white px-4 py-2 font-headline text-sm font-bold uppercase tracking-wider text-brand-ink transition hover:bg-brand-ink hover:text-white md:mt-0"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </div>

      {!isAdmin ? (
        // Non-admin basic page
        <section className="mt-10 border-4 border-dashed border-slate-200 p-12 text-center">
          <FileText className="mx-auto h-16 w-16 text-slate-400" />
          <h2 className="mt-4 font-headline text-3xl font-black uppercase text-brand-ink">Author Portal</h2>
          <p className="mx-auto mt-2 max-w-md text-slate-600">
            Welcome to the Big Club Talk publishing console. If you require full administration access (User Roles, Moderation, Categories), please contact the lead administrator.
          </p>
        </section>
      ) : editingPost ? (
        // Post Editor View
        <section className="mt-8 border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="font-headline text-3xl font-black uppercase text-brand-ink">
              {editingPost === "create" ? "Write New Article" : "Edit Article"}
            </h2>
            <button 
              onClick={handleCloseEditor}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-ink transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSavePost} className="mt-6 space-y-6">
            {editorError && (
              <div className="border-l-4 border-brand-red bg-red-50 p-4 text-sm font-medium text-brand-red">
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
                    className="mt-2 w-full border border-slate-200 p-3 font-headline text-2xl font-bold uppercase text-brand-ink focus:border-brand-blue focus:ring-0 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Slug (Optional, auto-generated)</label>
                  <input
                    type="text"
                    value={postSlug}
                    onChange={(e) => setPostSlug(e.target.value)}
                    placeholder="e.g. my-awesome-football-post"
                    className="mt-2 w-full border border-slate-200 p-3 text-sm focus:border-brand-blue focus:ring-0 focus:outline-none"
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
                    className="mt-2 w-full border border-slate-200 p-3 text-sm focus:border-brand-blue focus:ring-0 focus:outline-none"
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
                    className="mt-2 w-full border border-slate-200 p-3 font-serif text-base focus:border-brand-blue focus:ring-0 focus:outline-none"
                  />
                  <div className="mt-2 flex items-center justify-between gap-4 bg-slate-50 p-3 border border-slate-200 rounded">
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Insert Image in Body</span>
                      <p className="text-xs text-slate-500 mt-0.5">Upload an image to insert it at your cursor position.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 text-xs font-bold uppercase tracking-wider text-brand-ink bg-white hover:bg-slate-100 cursor-pointer transition select-none rounded">
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
                      {uploadingBody && <span className="text-xs text-slate-500 animate-pulse">Uploading...</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Settings */}
              <div className="space-y-6 border-t border-slate-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Category *</label>
                  <select
                    required
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="mt-2 w-full border border-slate-200 p-3 text-sm focus:border-brand-blue focus:ring-0 focus:outline-none font-medium"
                  >
                    <option value="" disabled>Select category</option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                    placeholder="e.g. transfers, arsenal, premier-league"
                    className="mt-2 w-full border border-slate-200 p-3 text-sm focus:border-brand-blue focus:ring-0 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Status</label>
                  <select
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value)}
                    className="mt-2 w-full border border-slate-200 p-3 text-sm focus:border-brand-blue focus:ring-0 focus:outline-none font-bold text-brand-ink"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cover Image *</label>
                  {postCoverUrl ? (
                    <div className="relative border border-slate-200 p-2 bg-slate-50 rounded">
                      <img 
                        src={postCoverUrl} 
                        alt={postCoverAlt || "Cover Preview"} 
                        className="w-full h-48 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPostCoverUrl("");
                          setPostCoverAlt("");
                        }}
                        className="absolute top-4 right-4 bg-brand-red text-white p-2 rounded hover:bg-red-700 shadow-md transition flex items-center justify-center border border-white"
                        title="Remove Image"
                      >
                        <X className="h-4 w-4 font-bold" />
                      </button>
                      <div className="mt-2 text-xs text-slate-500 font-medium truncate">
                        File: {postCoverUrl}
                      </div>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer rounded transition ${uploadingCover ? 'opacity-50 pointer-events-none' : ''}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-10 w-10 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-700 font-semibold uppercase tracking-wider">
                          {uploadingCover ? "Uploading Image..." : "Upload Cover Image"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Click to select a file from your computer
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
                  <input
                    type="text"
                    value={postCoverAlt}
                    onChange={(e) => setPostCoverAlt(e.target.value)}
                    placeholder="Describe the cover image details..."
                    className="mt-2 w-full border border-slate-200 p-3 text-sm focus:border-brand-blue focus:ring-0 focus:outline-none"
                  />
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={postFeatured}
                      onChange={(e) => setPostFeatured(e.target.checked)}
                      className="rounded border-slate-300 text-brand-red focus:ring-brand-red text-sm"
                    />
                    <span className="text-sm font-semibold uppercase text-brand-ink flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-brand-gold fill-current" /> Feature on Hero
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={postBreaking}
                      onChange={(e) => setPostBreaking(e.target.checked)}
                      className="rounded border-slate-300 text-brand-red focus:ring-brand-red text-sm"
                    />
                    <span className="text-sm font-semibold uppercase text-brand-ink">
                      ⚡ Breaking News
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={handleCloseEditor}
                className="border border-slate-200 px-6 py-3 font-headline font-bold uppercase tracking-wider text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brand-ink border-2 border-brand-ink text-white px-8 py-3 font-headline font-bold uppercase tracking-wider transition hover:bg-white hover:text-brand-ink"
              >
                Save Article
              </button>
            </div>
          </form>
        </section>
      ) : (
        // Standard Tabbed Dashboard layout
        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Left Tab selector */}
          <aside className="lg:col-span-1">
            <nav className="flex flex-row overflow-x-auto border-b border-slate-200 lg:flex-col lg:border-b-0 lg:border-r lg:border-slate-200 lg:pr-4 space-y-0 lg:space-y-1">
              {[
                { id: "overview", label: "Overview", icon: BarChart3, adminOnly: true },
                { id: "posts", label: "Posts Feed", icon: FileText, adminOnly: false },
                { id: "users", label: "User Roles", icon: Users, adminOnly: true },
                { id: "categories", label: "Categories", icon: Layers, adminOnly: true },
                { id: "comments", label: "Moderation", icon: MessageSquare, adminOnly: true },
                { id: "subscribers", label: "Subscribers", icon: Mail, adminOnly: true },
              ].filter(tab => !tab.adminOnly || isAdmin).map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 font-headline text-lg font-bold uppercase tracking-wider transition whitespace-nowrap lg:w-full ${
                      isSelected
                        ? "border-b-4 border-brand-red text-brand-red lg:border-b-0 lg:border-r-4 lg:bg-slate-50"
                        : "text-slate-500 hover:text-brand-ink"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right tab contents */}
          <div className="lg:col-span-4 font-sans">
            
            {/* Overview & Analytics Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Statistics panel */}
                {loadingAnalytics ? (
                  <div className="text-center py-10 font-bold text-slate-500">Loading control statistics...</div>
                ) : (
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                    {[
                      ["Users", stats.users || 0, Users, "bg-blue-50 text-brand-blue"],
                      ["Posts", stats.posts || 0, FileText, "bg-red-50 text-brand-red"],
                      ["Views", stats.views || 0, BarChart3, "bg-green-50 text-brand-green"],
                      ["Comments", stats.comments || 0, MessageSquare, "bg-amber-50 text-brand-gold"],
                      ["Likes", stats.likes || 0, Sparkles, "bg-purple-50 text-purple-600"]
                    ].map(([label, value, Icon, colorStyles]) => (
                      <div key={label} className="border border-slate-200 bg-white p-5 hover:shadow-md transition">
                        <div className={`inline-flex rounded-md p-2.5 ${colorStyles}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                        <p className="mt-1 font-headline text-3xl font-black text-brand-ink">{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Popular articles list */}
                <div className="border border-slate-200 bg-white p-6">
                  <h3 className="font-headline text-2xl font-black uppercase text-brand-ink flex items-center gap-2">
                    🔥 Popular Stories
                  </h3>
                  <p className="text-sm text-slate-500">The most read and viewed articles globally.</p>

                  <div className="mt-6">
                    <table className="hidden md:table w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                          <th className="pb-3">Title</th>
                          <th className="pb-3">Published Date</th>
                          <th className="pb-3 text-right">Total Reads</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {popularArticles.length === 0 ? (
                          <tr>
                            <td colSpan="3" className="py-6 text-center text-sm text-slate-500 font-medium">
                              No statistics recorded yet.
                            </td>
                          </tr>
                        ) : (
                          popularArticles.map((art) => (
                            <tr key={art._id} className="hover:bg-slate-50 transition group">
                              <td className="py-4 pr-4">
                                <a 
                                  href={`/article/${art.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-headline text-lg font-bold uppercase tracking-wide text-brand-ink group-hover:text-brand-red flex items-center gap-1.5"
                                >
                                  {art.title} <Eye className="h-4 w-4 text-slate-400 inline" />
                                </a>
                              </td>
                              <td className="py-4 text-sm text-slate-600">
                                {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : "Unpublished"}
                              </td>
                              <td className="py-4 text-right font-headline text-xl font-bold text-brand-ink">
                                {art.views}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    <div className="block md:hidden space-y-4">
                      {popularArticles.length === 0 ? (
                        <div className="py-6 text-center text-sm text-slate-500 font-medium bg-slate-50 border border-slate-100 rounded">
                          No statistics recorded yet.
                        </div>
                      ) : (
                        popularArticles.map((art) => (
                          <div key={art._id} className="border border-slate-200 bg-white p-4 rounded shadow-xs flex flex-col gap-2">
                            <a 
                              href={`/article/${art.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-headline text-base font-bold uppercase tracking-wide text-brand-ink hover:text-brand-red flex items-center gap-1.5"
                            >
                              {art.title} <Eye className="h-4 w-4 text-slate-400 inline" />
                            </a>
                            <div className="flex justify-between items-center text-xs text-slate-500 mt-1 pt-1 border-t border-slate-100">
                              <span>Published: {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : "Unpublished"}</span>
                              <span className="font-bold text-brand-ink">Reads: {art.views}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Feed Management */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="font-headline text-2xl font-black uppercase text-brand-ink">Editorial Desk</h3>
                    <p className="text-sm text-slate-500">Publish, feature, or remove editorial articles.</p>
                  </div>
                  <button
                    onClick={() => handleOpenEditor()}
                    className="flex items-center justify-center gap-2 bg-brand-red px-6 py-3 font-headline text-base font-bold uppercase tracking-wider text-white hover:bg-brand-ink transition"
                  >
                    <Plus className="h-5 w-5" /> Write Story
                  </button>
                </div>

                {/* Filter and search bar */}
                <div className="border border-slate-200 bg-white p-4">
                  <input
                    type="text"
                    placeholder="Search articles by title, tags..."
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 text-sm focus:border-brand-blue focus:outline-none"
                  />
                </div>

                {/* List posts Table */}
                <div className="border border-slate-200 bg-white">
                  {loadingPosts ? (
                    <div className="text-center py-10 font-bold text-slate-500">Loading articles...</div>
                  ) : (
                    <>
                      <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <th className="p-4">Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Author</th>
                            <th className="p-4">Flags</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {adminPosts
                            ?.filter(p => p.title?.toLowerCase().includes(postSearch.toLowerCase()))
                            .map((post) => (
                              <tr key={post._id} className="hover:bg-slate-50 transition">
                                <td className="p-4">
                                  <div className="font-headline text-base font-bold uppercase text-brand-ink">
                                    {post.title}
                                  </div>
                                  <div className="text-xs text-slate-400 mt-0.5">/{post.slug}</div>
                                </td>
                                <td className="p-4">
                                  <span 
                                    className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border text-white"
                                    style={{ backgroundColor: post.category?.color || "#E10600", borderColor: post.category?.color || "#E10600" }}
                                  >
                                    {post.category?.name || "Uncategorized"}
                                  </span>
                                </td>
                                <td className="p-4 text-slate-600 font-semibold">{post.author?.name || "Unknown"}</td>
                                <td className="p-4">
                                  <div className="flex flex-col gap-1">
                                    <button
                                      onClick={() => togglePostFeaturedMutation.mutate({ id: post._id, featured: !post.featured })}
                                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-left flex items-center gap-1 ${
                                        post.featured ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                                      }`}
                                    >
                                      ⭐ Featured: {post.featured ? "YES" : "NO"}
                                    </button>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <select
                                    value={post.status}
                                    onChange={(e) => togglePostStatusMutation.mutate({ id: post._id, status: e.target.value })}
                                    className={`text-xs font-bold uppercase tracking-wider p-1 rounded ${
                                      post.status === "published" 
                                        ? "bg-green-100 text-green-800" 
                                        : post.status === "archived" 
                                        ? "bg-slate-200 text-slate-800" 
                                        : "bg-yellow-100 text-yellow-800"
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
                                      className="p-1 text-slate-500 hover:text-brand-blue hover:bg-slate-100 rounded"
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
                                      className="p-1 text-slate-500 hover:text-brand-red hover:bg-slate-100 rounded"
                                      title="Delete article"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="block md:hidden divide-y divide-slate-100 bg-white border border-slate-200">
                      {adminPosts
                        ?.filter(p => p.title?.toLowerCase().includes(postSearch.toLowerCase()))
                        .map((post) => (
                          <div key={post._id} className="p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <div className="font-headline text-base font-bold uppercase text-brand-ink">
                                  {post.title}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">/{post.slug}</div>
                              </div>
                              <span 
                                className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border text-white rounded shrink-0"
                                style={{ backgroundColor: post.category?.color || "#E10600", borderColor: post.category?.color || "#E10600" }}
                              >
                                {post.category?.name || "Uncategorized"}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 text-xs text-slate-500 justify-between items-center bg-slate-50 p-2 rounded">
                              <span>By {post.author?.name || "Unknown"}</span>
                              <button
                                onClick={() => togglePostFeaturedMutation.mutate({ id: post._id, featured: !post.featured })}
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${
                                  post.featured ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                ⭐ Featured: {post.featured ? "YES" : "NO"}
                              </button>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-1">
                              <select
                                value={post.status}
                                onChange={(e) => togglePostStatusMutation.mutate({ id: post._id, status: e.target.value })}
                                className={`text-xs font-bold uppercase tracking-wider p-1 rounded ${
                                  post.status === "published" 
                                    ? "bg-green-100 text-green-800" 
                                    : post.status === "archived" 
                                    ? "bg-slate-200 text-slate-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                              </select>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenEditor(post)}
                                  className="p-1.5 text-slate-500 hover:text-brand-blue hover:bg-slate-100 border border-slate-200 rounded flex items-center gap-1 text-xs"
                                >
                                  <Edit2 className="h-3.5 w-3.5" /> Edit
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to permanently delete this post?")) {
                                      deletePostMutation.mutate(post._id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-brand-red hover:bg-slate-100 border border-slate-200 rounded flex items-center gap-1 text-xs"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      {(!adminPosts || adminPosts.length === 0) && (
                        <div className="p-6 text-center text-sm text-slate-500 font-medium">
                          No articles found.
                        </div>
                      )}
                    </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-headline text-2xl font-black uppercase text-brand-ink">User Credentials & Roles</h3>
                  <p className="text-sm text-slate-500">Configure dashboard accessibility roles and toggle user suspension states.</p>
                </div>

                <div className="border border-slate-200 bg-white p-4">
                  <input
                    type="text"
                    placeholder="Search users by name, email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 text-sm focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div className="border border-slate-200 bg-white">
                  {loadingUsers ? (
                    <div className="text-center py-10 font-bold text-slate-500">Loading user list...</div>
                  ) : (
                    <>
                      <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Verification</th>
                            <th className="p-4">Access Role</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {adminUsers
                            ?.filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()))
                            .map((usr) => (
                              <tr key={usr._id} className="hover:bg-slate-50 transition">
                                <td className="p-4 font-bold text-brand-ink">{usr.name}</td>
                                <td className="p-4 text-slate-600 font-medium">{usr.email}</td>
                                <td className="p-4">
                                  {usr.isEmailVerified ? (
                                    <span className="text-xs text-green-700 font-bold uppercase tracking-wider flex items-center gap-1">
                                      <Check className="h-4 w-4" /> Verified
                                    </span>
                                  ) : (
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                      Pending
                                    </span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <select
                                    disabled={usr.email === "admin@bigclubtalk.com"}
                                    value={usr.role}
                                    onChange={(e) => updateUserRoleMutation.mutate({ id: usr._id, role: e.target.value })}
                                    className="text-xs font-bold uppercase p-1.5 border border-slate-200 rounded focus:border-brand-blue"
                                  >
                                    <option value="user">User / Reader</option>
                                    <option value="author">Author / Writer</option>
                                    <option value="admin">Administrator</option>
                                  </select>
                                </td>
                                <td className="p-4">
                                  <button
                                    disabled={usr.email === "admin@bigclubtalk.com"}
                                    onClick={() => updateUserStatusMutation.mutate({ id: usr._id, status: usr.status === "active" ? "suspended" : "active" })}
                                    className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded transition border ${
                                      usr.status === "active" 
                                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                    }`}
                                  >
                                    {usr.status === "active" ? "Active" : "Suspended"}
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="block md:hidden divide-y divide-slate-100 bg-white border border-slate-200">
                      {adminUsers
                        ?.filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()))
                        .map((usr) => (
                          <div key={usr._id} className="p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-bold text-brand-ink text-base">{usr.name}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{usr.email}</div>
                              </div>
                              {usr.isEmailVerified ? (
                                <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 font-bold uppercase tracking-wider rounded">
                                  Verified
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 font-bold uppercase tracking-wider rounded">
                                  Pending
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 bg-slate-50 p-2.5 rounded">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-black text-slate-400 uppercase">Access Role</span>
                                <select
                                  disabled={usr.email === "admin@bigclubtalk.com"}
                                  value={usr.role}
                                  onChange={(e) => updateUserRoleMutation.mutate({ id: usr._id, role: e.target.value })}
                                  className="text-xs font-bold uppercase p-1 border border-slate-200 rounded"
                                >
                                  <option value="user">User / Reader</option>
                                  <option value="author">Author / Writer</option>
                                  <option value="admin">Administrator</option>
                                </select>
                              </div>

                              <div className="flex flex-col gap-0.5 items-end">
                                <span className="text-[9px] font-black text-slate-400 uppercase">Status</span>
                                <button
                                  disabled={usr.email === "admin@bigclubtalk.com"}
                                  onClick={() => updateUserStatusMutation.mutate({ id: usr._id, status: usr.status === "active" ? "suspended" : "active" })}
                                  className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border transition ${
                                    usr.status === "active" 
                                      ? "bg-green-50 text-green-700 border-green-200" 
                                      : "bg-red-50 text-red-700 border-red-200"
                                  }`}
                                >
                                  {usr.status === "active" ? "Active" : "Suspended"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      {(!adminUsers || adminUsers.length === 0) && (
                        <div className="p-6 text-center text-sm text-slate-500 font-medium">
                          No users found.
                        </div>
                      )}
                    </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div className="grid gap-8 md:grid-cols-3">
                {/* Category List */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="font-headline text-2xl font-black uppercase text-brand-ink">Topics & Categories</h3>
                    <p className="text-sm text-slate-500">Manage tags and global article categorization rules.</p>
                  </div>

                  <div className="border border-slate-200 bg-white">
                    {loadingCategories ? (
                      <div className="text-center py-10 font-bold text-slate-500">Loading categories...</div>
                    ) : (
                      <>
                        <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                              <th className="p-4">Category Name</th>
                              <th className="p-4">Slug</th>
                              <th className="p-4">Color Badge</th>
                              <th className="p-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {categories?.map((cat) => (
                              <tr key={cat._id} className="hover:bg-slate-50 transition">
                                <td className="p-4 font-headline text-lg font-bold uppercase text-brand-ink">{cat.name}</td>
                                <td className="p-4 text-slate-500">/{cat.slug}</td>
                                <td className="p-4">
                                  <span 
                                    className="inline-block w-8 h-8 rounded border border-slate-200 shadow-sm"
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
                                    className="text-slate-400 hover:text-brand-red transition p-1 hover:bg-slate-100 rounded"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="block md:hidden divide-y divide-slate-100 bg-white border border-slate-200">
                        {categories?.map((cat) => (
                          <div key={cat._id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span 
                                className="w-6 h-6 rounded border border-slate-200 shadow-sm shrink-0"
                                style={{ backgroundColor: cat.color }}
                              />
                              <div>
                                <div className="font-headline text-base font-bold uppercase text-brand-ink">{cat.name}</div>
                                <div className="text-xs text-slate-400 mt-0.5">/{cat.slug}</div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => {
                                      if (confirm(`Are you sure you want to delete Category "${cat.name}"?`)) {
                                        deleteCategoryMutation.mutate(cat._id);
                                      }
                                    }}
                              className="text-slate-400 hover:text-brand-red transition p-2 hover:bg-slate-50 border border-slate-200 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {(!categories || categories.length === 0) && (
                          <div className="p-6 text-center text-sm text-slate-500 font-medium">
                            No categories found.
                          </div>
                        )}
                      </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Add Category Form */}
                <div className="border border-slate-200 bg-white p-5 h-fit">
                  <h4 className="font-headline text-xl font-black uppercase text-brand-ink">Add Category</h4>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCatError("");
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
                      <div className="text-xs text-brand-red font-semibold">{catError}</div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500">Name *</label>
                      <input
                        type="text"
                        required
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        placeholder="e.g. Transfers"
                        className="mt-1 w-full border border-slate-200 p-2 text-sm focus:border-brand-blue focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500">Slug (Optional)</label>
                      <input
                        type="text"
                        value={catSlug}
                        onChange={(e) => setCatSlug(e.target.value)}
                        placeholder="e.g. transfers"
                        className="mt-1 w-full border border-slate-200 p-2 text-sm focus:border-brand-blue focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500">Theme Color</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {["#E10600", "#0057FF", "#FFB000", "#00875A", "#101820"].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCatColor(c)}
                            className={`w-7 h-7 rounded border transition ${
                              catColor === c ? "ring-2 ring-brand-blue ring-offset-2 scale-110" : "border-slate-300"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <input
                        type="text"
                        value={catColor}
                        onChange={(e) => setCatColor(e.target.value)}
                        className="mt-3 w-full border border-slate-200 p-2 text-xs focus:border-brand-blue focus:outline-none"
                        placeholder="#Hex color code"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-ink text-white font-headline text-base font-bold uppercase tracking-wider py-2.5 transition hover:bg-brand-red"
                    >
                      Save Category
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Moderation Tab */}
            {activeTab === "comments" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-headline text-2xl font-black uppercase text-brand-ink">Comment Moderation</h3>
                  <p className="text-sm text-slate-500">Manage, hide, or delete community responses.</p>
                </div>

                <div className="border border-slate-200 bg-white p-4">
                  <input
                    type="text"
                    placeholder="Search comment contents, authors..."
                    value={commentSearch}
                    onChange={(e) => setCommentSearch(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 text-sm focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div className="border border-slate-200 bg-white">
                  {loadingComments ? (
                    <div className="text-center py-10 font-bold text-slate-500">Loading comments...</div>
                  ) : (
                    <>
                      <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <th className="p-4">Author</th>
                            <th className="p-4">Article</th>
                            <th className="p-4">Comment Content</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {adminComments
                            ?.filter(c => c.content?.toLowerCase().includes(commentSearch.toLowerCase()) || c.author?.name?.toLowerCase().includes(commentSearch.toLowerCase()))
                            .map((comm) => (
                              <tr key={comm._id} className="hover:bg-slate-50 transition">
                                <td className="p-4">
                                  <div className="font-bold text-brand-ink">{comm.author?.name}</div>
                                  <div className="text-xs text-slate-400">{comm.author?.email}</div>
                                </td>
                                <td className="p-4">
                                  <div className="font-headline text-xs font-bold uppercase truncate max-w-[150px]">
                                    {comm.post?.title || "Deleted Article"}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <p className="text-slate-700 text-xs italic break-words max-w-[320px]">
                                    "{comm.content}"
                                  </p>
                                </td>
                                <td className="p-4">
                                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border ${
                                    comm.status === "visible" 
                                      ? "bg-green-50 text-green-700 border-green-200" 
                                      : "bg-red-50 text-red-700 border-red-200"
                                  }`}>
                                    {comm.status}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => toggleCommentStatusMutation.mutate({
                                        id: comm._id,
                                        status: comm.status === "visible" ? "hidden" : "visible"
                                      })}
                                      className={`p-1 transition rounded border ${
                                        comm.status === "visible" 
                                          ? "text-slate-400 hover:text-brand-red hover:bg-red-50 border-transparent" 
                                          : "text-slate-400 hover:text-green-700 hover:bg-green-50 border-transparent"
                                      }`}
                                      title={comm.status === "visible" ? "Hide comment" : "Show comment"}
                                    >
                                      {comm.status === "visible" ? <X className="h-4.5 w-4.5" /> : <Check className="h-4.5 w-4.5" />}
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm("Are you sure you want to delete this comment completely?")) {
                                          deleteCommentMutation.mutate(comm._id);
                                        }
                                      }}
                                      className="p-1 text-slate-400 hover:text-brand-red transition hover:bg-slate-100 rounded"
                                      title="Delete completely"
                                    >
                                      <Trash2 className="h-4.5 w-4.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="block md:hidden divide-y divide-slate-100 bg-white border border-slate-200">
                      {adminComments
                        ?.filter(c => c.content?.toLowerCase().includes(commentSearch.toLowerCase()) || c.author?.name?.toLowerCase().includes(commentSearch.toLowerCase()))
                        .map((comm) => (
                          <div key={comm._id} className="p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-bold text-brand-ink">{comm.author?.name}</div>
                                <div className="text-xs text-slate-400">{comm.author?.email}</div>
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded ${
                                comm.status === "visible" 
                                  ? "bg-green-50 text-green-700 border-green-200" 
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}>
                                {comm.status}
                              </span>
                            </div>

                            <div className="text-xs text-slate-500 mt-1">
                              Article: <span className="font-bold text-brand-ink uppercase font-headline">{comm.post?.title || "Deleted Article"}</span>
                            </div>

                            <div className="bg-slate-50 p-2 rounded text-xs text-slate-700 italic border border-slate-100 mt-1">
                              "{comm.content}"
                            </div>

                            <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => toggleCommentStatusMutation.mutate({
                                  id: comm._id,
                                  status: comm.status === "visible" ? "hidden" : "visible"
                                })}
                                className={`px-2.5 py-1 text-xs font-bold rounded border ${
                                  comm.status === "visible" 
                                    ? "text-red-700 bg-red-50 border-red-200" 
                                    : "text-green-700 bg-green-50 border-green-200"
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
                                className="px-2.5 py-1 text-xs font-bold rounded border border-slate-200 text-slate-600 hover:text-brand-red"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      {(!adminComments || adminComments.length === 0) && (
                        <div className="p-6 text-center text-sm text-slate-500 font-medium">
                          No comments found.
                        </div>
                      )}
                    </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Subscribers Tab */}
            {activeTab === "subscribers" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-headline text-2xl font-black uppercase text-brand-ink">Newsletter Mailing List</h3>
                  <p className="text-sm text-slate-500">View emails subscribed to receive updates from the newsroom.</p>
                </div>

                <div className="border border-slate-200 bg-white">
                  {loadingSubscribers ? (
                    <div className="text-center py-10 font-bold text-slate-500">Loading subscribers...</div>
                  ) : (
                    <>
                      <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <th className="p-4">Email Address</th>
                            <th className="p-4">Subscribed At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {subscribers?.map((sub) => (
                            <tr key={sub._id} className="hover:bg-slate-50 transition">
                              <td className="p-4 font-semibold text-brand-ink">{sub.email}</td>
                              <td className="p-4 text-slate-500">
                                {new Date(sub.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          {subscribers?.length === 0 && (
                            <tr>
                              <td colSpan="2" className="p-6 text-center text-slate-400 font-medium">
                                No newsletter subscribers registered yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="block md:hidden divide-y divide-slate-100 bg-white border border-slate-200">
                      {subscribers?.map((sub) => (
                        <div key={sub._id} className="p-4 flex justify-between items-center">
                          <span className="font-semibold text-brand-ink text-sm">{sub.email}</span>
                          <span className="text-slate-400 text-xs">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                      {subscribers?.length === 0 && (
                        <div className="p-6 text-center text-slate-400 font-medium">
                          No newsletter subscribers registered yet.
                        </div>
                      )}
                    </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </main>
  );
}
