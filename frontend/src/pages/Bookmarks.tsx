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

  // ==========================================
  // LOAD BOOKMARKS
  // ==========================================

  const loadBookmarks = async () => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
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

  // ==========================================
  // REMOVE BOOKMARK
  // ==========================================

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

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!token) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-10 text-center shadow-lg">
            <div className="mb-5 text-5xl sm:text-6xl">
              🔖
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Login Required
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-600">
              Please login to view and manage your bookmarked
              resources.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              Login
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mb-4 text-5xl">
              🔖
            </div>

            <p className="text-lg sm:text-xl font-semibold text-gray-700">
              Loading Bookmarks...
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Please wait
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">
                    🔖
                  </span>

                  <h1 className="text-3xl sm:text-4xl font-bold text-purple-700">
                    My Bookmarks
                  </h1>
                </div>

                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Your saved study resources in one place
                </p>

                <p className="mt-2 text-sm font-medium text-gray-500">
                  {resources.length}{" "}
                  {resources.length === 1
                    ? "resource"
                    : "resources"}{" "}
                  saved
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex w-full md:w-auto items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm sm:text-base font-semibold text-gray-700 transition hover:border-purple-400 hover:bg-purple-50"
              >
                ← Browse Resources
              </Link>

            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-300 bg-red-100 p-4 text-red-700">
              <p className="font-semibold">
                ❌ {error}
              </p>

              <button
                type="button"
                onClick={loadBookmarks}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}

          {!error && resources.length === 0 ? (
            <div className="rounded-2xl bg-white p-7 sm:p-10 text-center shadow-lg">
              <div className="mb-5 text-5xl sm:text-6xl">
                🔖
              </div>

              <h2 className="text-2xl font-bold text-gray-800">
                No Bookmarks Yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm sm:text-base text-gray-500">
                Save Notes, PYQs, Syllabus and Ebooks
                using the Bookmark button. Your saved
                resources will appear here.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                Explore Resources
              </Link>
            </div>
          ) : (

            /* BOOKMARK CARDS */

            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">

              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="flex h-full flex-col rounded-2xl bg-white p-5 sm:p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* TITLE + CATEGORY */}

                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 text-lg sm:text-xl font-bold text-gray-800 break-words">
                      {resource.title}
                    </h2>

                    <span className="shrink-0 rounded-full bg-purple-100 px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-purple-700">
                      {resource.category}
                    </span>
                  </div>

                  {/* BRANCH */}

                  {resource.branch && (
                    <div className="mt-4">
                      <p className="text-xs sm:text-sm font-semibold text-purple-600">
                        Branch
                      </p>

                      <p className="mt-1 text-sm sm:text-base text-gray-700">
                        {resource.branch}
                      </p>
                    </div>
                  )}

                  {/* SEMESTER */}

                  {resource.semester && (
                    <div className="mt-3">
                      <p className="text-xs sm:text-sm font-semibold text-purple-600">
                        Semester
                      </p>

                      <p className="mt-1 text-sm sm:text-base text-gray-700">
                        {resource.semester}
                      </p>
                    </div>
                  )}

                  {/* SUBJECT */}

                  {resource.subject && (
                    <div className="mt-3">
                      <p className="text-xs sm:text-sm font-semibold text-gray-500">
                        Subject
                      </p>

                      <p className="mt-1 text-sm sm:text-base text-gray-700">
                        {resource.subject}
                      </p>
                    </div>
                  )}

                  {/* DESCRIPTION */}

                  {resource.description && (
                    <p className="mt-3 line-clamp-3 text-sm sm:text-base text-gray-600">
                      {resource.description}
                    </p>
                  )}

                  {/* FILE NAME */}

                  {resource.fileName && (
                    <div className="mt-4 rounded-lg bg-gray-50 p-3">
                      <p
                        className="truncate text-xs sm:text-sm text-gray-600"
                        title={resource.fileName}
                      >
                        📄 {resource.fileName}
                      </p>
                    </div>
                  )}

                  {/* BOOKMARK INFO */}

                  {resource.bookmarkedAt && (
                    <p className="mt-3 text-xs text-gray-400">
                      Saved on{" "}
                      {new Date(
                        resource.bookmarkedAt
                      ).toLocaleDateString()}
                    </p>
                  )}

                  {/* ACTIONS */}

                  <div className="mt-auto pt-5">

                    {/* OPEN + DOWNLOAD */}

                    <div className="flex w-full flex-col gap-3 sm:flex-row">
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full sm:flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
                      >
                        📖 Open
                      </a>

                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={
                          resource.fileName || undefined
                        }
                        className="flex w-full sm:flex-1 items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 active:bg-green-800"
                      >
                        ⬇️ Download
                      </a>
                    </div>

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() =>
                        removeBookmark(resource._id)
                      }
                      disabled={
                        removingId === resource._id
                      }
                      className="mt-3 flex w-full items-center justify-center rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {removingId === resource._id
                        ? "Removing..."
                        : "★ Remove Bookmark"}
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}