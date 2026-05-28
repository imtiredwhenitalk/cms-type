"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface EditorState {
  id?: number;
  title: string;
  content: string;
}

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author_name: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export function NewsEditor({ locale }: { locale: string }) {
  const { user, token, isLoading } = useAuth();
  
  const [editor, setEditor] = useState<EditorState>({
    title: "",
    content: "",
  });

  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<"edit" | "view">("view");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Show auth error if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      setError("Please log in to create or edit articles");
    }
  }, [user, isLoading]);

  // Fetch articles
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/news");
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      setArticles(data.news || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching articles");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !token) {
      setError("Please log in to save articles");
      return;
    }

    if (!editor.title.trim() || !editor.content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const method = editor.id ? "PUT" : "POST";
      const endpoint = editor.id ? `/api/news/${editor.id}` : "/api/news";

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editor.title,
          content: editor.content,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save article");
      }

      setSuccess(
        editor.id ? "Article updated successfully!" : "Article created successfully!"
      );
      setEditor({ title: "", content: "" });
      setMode("view");
      fetchArticles();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving article");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!user || !token) {
      setError("Please log in to delete articles");
      return;
    }

    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete article");
      }

      setSuccess("Article deleted successfully!");
      fetchArticles();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting article");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: NewsItem) => {
    if (!user || !token) {
      setError("Please log in to edit articles");
      return;
    }

    // Only allow editing own articles or if admin
    // TODO: Add is_admin check when available in auth context
    if (article.user_id !== user.user_id) {
      setError("You can only edit your own articles");
      return;
    }

    setEditor({
      id: article.id,
      title: article.title,
      content: article.content,
    });
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditor({ title: "", content: "" });
    setMode("view");
  };

  if (isLoading) {
    return <div className="text-center text-slate-400">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
        <p className="text-slate-300 mb-4">Please log in to create and manage articles</p>
        <Link href={`/${locale}/auth/login`} className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Editor Section */}
      <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          {mode === "edit" ? "Edit Article" : "Create New Article"}
        </h2>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={editor.title}
            onChange={(e) => setEditor({ ...editor, title: e.target.value })}
            placeholder="Article title..."
            className="w-full px-4 py-2 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Content Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Content
          </label>
          <textarea
            value={editor.content}
            onChange={(e) => setEditor({ ...editor, content: e.target.value })}
            placeholder="Write your article content here..."
            rows={8}
            className="w-full px-4 py-2 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-green-400 text-sm mb-4">
            {success}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : mode === "edit" ? "Update" : "Create"}
          </button>
          {mode === "edit" && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-2 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800/50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Articles List */}
      <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Your Articles</h2>

        {articles.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No articles yet. Create your first one!</p>
        ) : (
          <div className="space-y-4">
            {articles
              .filter((article) => article.user_id === user.user_id)
              .map((article) => (
                <div
                  key={article.id}
                  className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-4 hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="px-3 py-1 text-sm rounded border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="px-3 py-1 text-sm rounded border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm line-clamp-2 mb-2">{article.content}</p>
                  <p className="text-xs text-slate-500">
                    Created: {new Date(article.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

      setSuccess("Article deleted successfully!");
      fetchArticles();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting article");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: NewsItem) => {
    setEditor({
      id: article.id,
      title: article.title,
      content: article.content,
    });
    setMode("edit");
    setSelectedId(article.id);
  };

  const handleNew = () => {
    setEditor({ title: "", content: "" });
    setMode("edit");
    setSelectedId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">News Editor</h1>
          <p className="text-slate-400">Create, edit, and manage articles</p>
        </div>
        <Link
          href={`/${locale}/news`}
          className="px-4 py-2 rounded-lg border border-slate-800/50 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium"
        >
          ← Back to News
        </Link>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-green-400">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Panel */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/40 to-slate-950/40 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {mode === "edit"
                  ? editor.id
                    ? "Edit Article"
                    : "Create New Article"
                  : "View Articles"}
              </h2>
              {mode === "view" && (
                <button
                  onClick={handleNew}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                >
                  + New Article
                </button>
              )}
            </div>

            {mode === "edit" ? (
              <div className="space-y-4">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editor.title}
                    onChange={(e) =>
                      setEditor({ ...editor, title: e.target.value })
                    }
                    placeholder="Article title..."
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/70 transition-all"
                  />
                  <p className="text-xs text-slate-400 mt-1">Max 255 characters</p>
                </div>

                {/* Content Textarea */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={editor.content}
                    onChange={(e) =>
                      setEditor({ ...editor, content: e.target.value })
                    }
                    placeholder="Article content..."
                    rows={12}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/70 transition-all resize-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {editor.content.length} / 10000 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : editor.id ? "Update" : "Create"}
                  </button>
                  <button
                    onClick={() => {
                      setMode("view");
                      setEditor({ title: "", content: "" });
                    }}
                    className="flex-1 py-2.5 rounded-lg border border-slate-800/50 hover:border-slate-700 text-slate-300 hover:text-slate-200 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                Select an article to view or create a new one
              </div>
            )}
          </div>
        </div>

        {/* Articles List */}
        <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/40 to-slate-950/40 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>Articles ({articles.length})</span>
          </h3>

          {loading && !articles.length ? (
            <div className="text-center py-8 text-slate-400 text-sm">Loading...</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No articles yet</div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedId === article.id
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-slate-800/50 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div onClick={() => handleEdit(article)} className="space-y-1">
                    <p className="text-sm font-medium text-white line-clamp-2">
                      {article.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      ID: {article.id} · {article.content.length} chars
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(article.id);
                    }}
                    className="mt-2 w-full py-1.5 px-2 text-xs rounded-md border border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
