import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../services/api";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  category: string;
  branch?: string;
  semester?: string;
  subject?: string;
  fileUrl: string;
  fileName?: string;
  createdAt?: string;
  bookmarkId?: string;
  bookmarkedAt?: string;
}

export default function Bookmarks() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");

  const token = localStorage.getItem("token");

  // LOAD BOOKMARKS
  const loadBookmarks = async () => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setResources([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      setResources(response.data.resources || []);
    } catch (err: any) {
      console.error("Bookmarks loading error:", err);

      if (err.response?.status === 401) {
        setError("Please login again to view your bookmarks.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load bookmarks. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  // REMOVE BOOKMARK
  const removeBookmark = async (resourceId: string) => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setError("Please login first.");
      return;
    }

    try {
      setRemovingId(resourceId);

      await api.delete(`/api/bookmarks/${resourceId}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      setResources((currentResources) =>
        currentResources.filter(
          (resource) => resource._id !== resourceId
        )
      );
    } catch (err: any) {
      console.error("Remove bookmark error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to remove bookmark."
      );
    } finally {
      setRemovingId("");
    }
  };

  // LOGIN REQUIRED
  if (!token) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100 text-4xl">
              🔖
            </div>

            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Login Required
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Please login to view and manage your bookmarked resources.
            </p>

            <Link
              to="/login"
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-purple-700 sm:w-auto"
            >
              Login to Continue
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />

            <h2 className="text-lg font-bold text-slate-700">
              Loading Bookmarks...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we fetch your saved resources.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // MAIN PAGE
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl">

          {/* HERO HEADER */}
          <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-800 p-6 text-white shadow-lg sm:p-9">
            <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-indigo-300/10 blur-2xl" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-purple-100">
                  <span>🔖</span>
                  <span>Your Personal Collection</span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  My Bookmarks
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
                  All your saved study materials, notes, previous year
                  questions and ebooks in one place.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold">
                  <span className="text-lg">📚</span>
                  {resources.length}{" "}
                  {resources.length === 1 ? "Resource" : "Resources"} Saved
                </div>
              </div>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-purple-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-purple-50"
              >
                <span>←</span>
                Browse Resources
              </Link>
            </div>
          </section>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-red-700">
                  Unable to load bookmarks
                </p>
                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={loadBookmarks}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!error && resources.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-purple-50 text-5xl">
                🔖
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                No Bookmarks Yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                You haven't saved any resources yet. Explore Notes, PYQs,
                Syllabus and Ebooks, then use the Bookmark button to save
                your favourite study materials.
              </p>

              <Link
                to="/"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-purple-700"
              >
                Explore Resources
                <span>→</span>
              </Link>
            </div>
          )}

          {/* BOOKMARK CARDS */}
          {resources.length > 0 && (
            <>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Saved Resources
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Access or remove your saved study materials.
                  </p>
                </div>

                <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-sm font-bold text-purple-700">
                  {resources.length} Saved
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                  <article
                    key={resource._id}
                    className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl sm:p-6"
                  >
                    {/* TITLE AND CATEGORY */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 break-words text-lg font-bold leading-6 text-slate-800 transition group-hover:text-purple-700">
                        {resource.title}
                      </h3>

                      <span className="shrink-0 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 ring-1 ring-purple-100">
                        {resource.category}
                      </span>
                    </div>

                    {/* RESOURCE DETAILS */}
                    <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4">
                      {resource.branch && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Branch
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {resource.branch}
                          </p>
                        </div>
                      )}

                      {resource.semester && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Semester
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {resource.semester}
                          </p>
                        </div>
                      )}

                      {resource.subject && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Subject
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {resource.subject}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    {resource.description && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                        {resource.description}
                      </p>
                    )}

                    {/* FILE NAME */}
                    {resource.fileName && (
                      <div className="mt-4 flex min-w-0 items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/70 p-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
                          📄
                        </span>

                        <p
                          className="min-w-0 truncate text-sm font-medium text-slate-600"
                          title={resource.fileName}
                        >
                          {resource.fileName}
                        </p>
                      </div>
                    )}

                    {/* BOOKMARK DATE */}
                    {resource.bookmarkedAt && (
                      <p className="mt-4 text-xs text-slate-400">
                        Saved on{" "}
                        {new Date(resource.bookmarkedAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="mt-auto space-y-3 pt-6">
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 active:bg-indigo-800"
                        >
                          <span>📖</span>
                          Open PDF
                        </a>

                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={resource.fileName || undefined}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 active:bg-emerald-800"
                        >
                          <span>⬇️</span>
                          Download
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeBookmark(resource._id)}
                        disabled={removingId === resource._id}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {removingId === resource._id ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                            Removing...
                          </>
                        ) : (
                          <>
                            <span>★</span>
                            Remove Bookmark
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}