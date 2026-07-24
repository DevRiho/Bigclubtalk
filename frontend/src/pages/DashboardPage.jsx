import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, FileText, MessageSquare, Users, 
  Layers, Mail, Shield, LogOut 
} from "lucide-react";
import { metaService } from "../services/metaService";
import { postService } from "../services/postService";
import { useAuth } from "../context/AuthContext";

// Modular tab imports
import { OverviewTab } from "../components/dashboard/OverviewTab";
import { PostsTab } from "../components/dashboard/PostsTab";
import { UsersTab } from "../components/dashboard/UsersTab";
import { CategoriesTab } from "../components/dashboard/CategoriesTab";
import { CommentsTab } from "../components/dashboard/CommentsTab";
import { SubscribersTab } from "../components/dashboard/SubscribersTab";
import { PostEditorForm } from "../components/dashboard/PostEditorForm";

export function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState(isAdmin ? "overview" : "posts");

  // Auth check - redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Ensure non-admins aren't stuck on administrative overview tab
  useEffect(() => {
    if (user && user.role !== "admin" && activeTab === "overview") {
      setActiveTab("posts");
    }
  }, [user, activeTab]);

  // Tab data fetching queries
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: metaService.analytics,
    enabled: isAdmin && !!user
  });

  const { data: adminUsers, isLoading: loadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: metaService.adminUsers,
    enabled: isAdmin && !!user
  });

  const { data: adminPosts, isLoading: loadingPosts, refetch: refetchPosts } = useQuery({
    queryKey: ["adminPosts", isAdmin],
    queryFn: () => isAdmin 
      ? metaService.adminPosts() 
      : postService.list({ author: user?._id, status: "all" }).then(res => res.data),
    enabled: !!user
  });

  const { data: adminComments, isLoading: loadingComments, refetch: refetchComments } = useQuery({
    queryKey: ["adminComments"],
    queryFn: metaService.adminComments,
    enabled: isAdmin && !!user
  });

  const { data: subscribers, isLoading: loadingSubscribers } = useQuery({
    queryKey: ["subscribers"],
    queryFn: metaService.subscribers,
    enabled: isAdmin && !!user
  });

  const { data: categories, isLoading: loadingCategories, refetch: refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: metaService.categories,
    enabled: !!user
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
    setPostContent(before + textToInsert + after);
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
      queryClient.invalidateQueries(["featured-posts"]);
      queryClient.invalidateQueries(["latest-posts"]);
      queryClient.invalidateQueries(["trending-posts"]);
      refetchPosts();
      setEditingPost(null);
    } catch (err) {
      setEditorError(err.response?.data?.message || "Failed to save the article");
    }
  };

  // Mutations
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

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-red border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xs font-black uppercase text-slate-500 tracking-widest font-sans">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const stats = analytics || { users: 0, posts: 0, comments: 0, views: 0, likes: 0 };
  const popularArticles = analytics?.popularArticles || [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between border-b border-slate-200 dark:border-slate-800 pb-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-brand-red">Newsroom Control Center</p>
          <h1 className="mt-1 font-headline text-5xl font-black uppercase text-brand-ink dark:text-slate-100">
            {isAdmin ? "Admin Dashboard" : "Publisher Workspace"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-brand-ink dark:bg-slate-800 text-[10px] font-bold uppercase text-white px-2 py-0.5 tracking-wider">
              <Shield className="h-3 w-3 text-brand-gold" /> {user.role}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Logged in as {user.name} ({user.email})</span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="mt-4 flex items-center justify-center gap-2 border-2 border-brand-ink dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 font-headline text-sm font-bold uppercase tracking-wider text-brand-ink dark:text-slate-100 transition hover:bg-brand-ink hover:text-white dark:hover:bg-slate-800 md:mt-0 rounded-sm"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </div>

      {!isAdmin ? (
        // Non-admin basic workspace display (only lists posts)
        <div className="mt-8">
          {editingPost ? (
            <PostEditorForm
              editingPost={editingPost}
              handleCloseEditor={handleCloseEditor}
              handleSavePost={handleSavePost}
              editorError={editorError}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postSlug={postSlug}
              setPostSlug={setPostSlug}
              postExcerpt={postExcerpt}
              setPostExcerpt={setPostExcerpt}
              postContent={postContent}
              setPostContent={setPostContent}
              postCategory={postCategory}
              setPostCategory={setPostCategory}
              postTags={postTags}
              setPostTags={setPostTags}
              postStatus={postStatus}
              setPostStatus={setPostStatus}
              postFeatured={postFeatured}
              setPostFeatured={setPostFeatured}
              postBreaking={postBreaking}
              setPostBreaking={setPostBreaking}
              postCoverUrl={postCoverUrl}
              setPostCoverUrl={setPostCoverUrl}
              postCoverAlt={postCoverAlt}
              setPostCoverAlt={setPostCoverAlt}
              uploadingCover={uploadingCover}
              handleCoverImageUpload={handleCoverImageUpload}
              uploadingBody={uploadingBody}
              handleBodyImageUpload={handleBodyImageUpload}
              categories={categories}
            />
          ) : (
            <PostsTab
              adminPosts={adminPosts}
              loadingPosts={loadingPosts}
              handleOpenEditor={handleOpenEditor}
              togglePostStatusMutation={togglePostStatusMutation}
              togglePostFeaturedMutation={togglePostFeaturedMutation}
              deletePostMutation={deletePostMutation}
              isAdmin={false}
              postSearch={postSearch}
              setPostSearch={setPostSearch}
            />
          )}
        </div>
      ) : editingPost ? (
        // Post Editor View
        <PostEditorForm
          editingPost={editingPost}
          handleCloseEditor={handleCloseEditor}
          handleSavePost={handleSavePost}
          editorError={editorError}
          postTitle={postTitle}
          setPostTitle={setPostTitle}
          postSlug={postSlug}
          setPostSlug={setPostSlug}
          postExcerpt={postExcerpt}
          setPostExcerpt={setPostExcerpt}
          postContent={postContent}
          setPostContent={setPostContent}
          postCategory={postCategory}
          setPostCategory={setPostCategory}
          postTags={postTags}
          setPostTags={setPostTags}
          postStatus={postStatus}
          setPostStatus={setPostStatus}
          postFeatured={postFeatured}
          setPostFeatured={setPostFeatured}
          postBreaking={postBreaking}
          setPostBreaking={setPostBreaking}
          postCoverUrl={postCoverUrl}
          setPostCoverUrl={setPostCoverUrl}
          postCoverAlt={postCoverAlt}
          setPostCoverAlt={setPostCoverAlt}
          uploadingCover={uploadingCover}
          handleCoverImageUpload={handleCoverImageUpload}
          uploadingBody={uploadingBody}
          handleBodyImageUpload={handleBodyImageUpload}
          categories={categories}
        />
      ) : (
        // Standard Admin layout with sidebar tabs
        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Left Tab selector */}
          <aside className="lg:col-span-1">
            <nav className="flex flex-row overflow-x-auto border-b border-slate-200 dark:border-slate-800 lg:flex-col lg:border-b-0 lg:border-r lg:border-slate-200 lg:dark:border-slate-800 lg:pr-4 space-y-0 lg:space-y-1">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "posts", label: "Posts Feed", icon: FileText },
                { id: "users", label: "User Roles", icon: Users },
                { id: "categories", label: "Categories", icon: Layers },
                { id: "comments", label: "Moderation", icon: MessageSquare },
                { id: "subscribers", label: "Subscribers", icon: Mail },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 font-headline text-lg font-bold uppercase tracking-wider transition whitespace-nowrap lg:w-full rounded-sm ${
                      isSelected
                        ? "border-b-4 border-brand-red text-brand-red lg:border-b-0 lg:border-r-4 lg:bg-slate-50 dark:lg:bg-slate-900/40"
                        : "text-slate-500 hover:text-brand-ink dark:text-slate-400 dark:hover:text-slate-200"
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
            {activeTab === "overview" && (
              <OverviewTab
                stats={stats}
                popularArticles={popularArticles}
                loadingAnalytics={loadingAnalytics}
              />
            )}

            {activeTab === "posts" && (
              <PostsTab
                adminPosts={adminPosts}
                loadingPosts={loadingPosts}
                handleOpenEditor={handleOpenEditor}
                togglePostStatusMutation={togglePostStatusMutation}
                togglePostFeaturedMutation={togglePostFeaturedMutation}
                deletePostMutation={deletePostMutation}
                isAdmin={true}
                postSearch={postSearch}
                setPostSearch={setPostSearch}
              />
            )}

            {activeTab === "users" && (
              <UsersTab
                adminUsers={adminUsers}
                loadingUsers={loadingUsers}
                updateUserRoleMutation={updateUserRoleMutation}
                updateUserStatusMutation={updateUserStatusMutation}
                userSearch={userSearch}
                setUserSearch={setUserSearch}
                currentUserEmail={user.email}
              />
            )}

            {activeTab === "categories" && (
              <CategoriesTab
                categories={categories}
                loadingCategories={loadingCategories}
                createCategoryMutation={createCategoryMutation}
                deleteCategoryMutation={deleteCategoryMutation}
                catName={catName}
                setCatName={setCatName}
                catSlug={catSlug}
                setCatSlug={setCatSlug}
                catColor={catColor}
                setCatColor={setCatColor}
                catError={catError}
              />
            )}

            {activeTab === "comments" && (
              <CommentsTab
                adminComments={adminComments}
                loadingComments={loadingComments}
                toggleCommentStatusMutation={toggleCommentStatusMutation}
                deleteCommentMutation={deleteCommentMutation}
                commentSearch={commentSearch}
                setCommentSearch={setCommentSearch}
              />
            )}

            {activeTab === "subscribers" && (
              <SubscribersTab
                subscribers={subscribers}
                loadingSubscribers={loadingSubscribers}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
