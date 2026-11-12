import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../services/api";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface BookmarkResponse {
  resources?: unknown[];
}

interface Resource {
  _id: string;
  title: string;
  description?: string;
  branch: string;
  semester: string;
  category: string;
  subject?: string;
  fileUrl: string;
  fileName?: string;
  createdAt: string;
}

interface RecentResourcesResponse {
  resources?: Resource[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User>({});
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Unable to read user data:", error);
      }
    }

    const loadDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<BookmarkResponse>(
          "/api/bookmarks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookmarkCount(response.data?.resources?.length || 0);
      } catch (error) {
        console.error("Dashboard bookmark loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadRecentResources = async () => {
      try {
        const response = await api.get<RecentResourcesResponse>(
          "/api/resources/recent?limit=6"
        );

        setRecentResources(response.data?.resources || []);
      } catch (error) {
        console.error("Recently added resources loading error:", error);
      } finally {
        setRecentLoading(false);
      }
    };

    loadDashboardData();
    loadRecentResources();
  }, []);

  const displayName =
    user.name?.trim() ||
    user.email?.split("@")[0] ||
    "Student";

  const firstName = displayName.split(" ")[0];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl">

          {/* WELCOME HEADER */}
          <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 text-white shadow-lg sm:p-9">
            <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-blue-300/10 blur-2xl" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-blue-100">
                  Student Dashboard
                </span>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Welcome, {firstName}!
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                  Manage your saved resources, study planner and AI learning
                  tools from one place.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm">
                <div className="text-4xl">🎓</div>
                <p className="mt-3 text-base font-bold">
                  Keep Learning
                </p>
                <p className="mt-1 text-xs text-blue-100">
                  Keep Growing Every Day
                </p>
              </div>
            </div>
          </section>

          {/* PROFILE AND STATISTICS */}
          <section className="grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* PROFILE CARD */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-extrabold text-white shadow-md">
                  {firstName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Student Profile
                  </p>

                  <h2 className="mt-1 truncate text-xl font-bold text-slate-800">
                    {displayName}
                  </h2>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {user.email || "Student account"}
                  </p>

                  {user.role && (
                    <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-blue-700">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* BOOKMARK STAT */}
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Saved Resources
                  </p>

                  <p className="mt-3 text-4xl font-extrabold text-purple-700">
                    {loading ? "..." : bookmarkCount}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Bookmarked resources
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                  🔖
                </div>
              </div>

              <Link
                to="/bookmarks"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-purple-600 transition hover:text-purple-800"
              >
                View Bookmarks →
              </Link>
            </div>
          </section>

          {/* RECENTLY ADDED */}
          <section className="mt-9">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
                  Recently Added
                </h2>

                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                  Check out the latest study resources.
                </p>
              </div>

              <Link
                to="/notes"
                className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 transition hover:text-blue-800"
              >
                View All Resources →
              </Link>
            </div>

            {/* LOADING SKELETON */}
            {recentLoading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
                  >
                    <div className="h-5 w-24 rounded-full bg-slate-200" />
                    <div className="mt-5 h-6 w-3/4 rounded bg-slate-200" />
                    <div className="mt-4 h-4 w-full rounded bg-slate-100" />
                    <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
                    <div className="mt-6 h-11 w-full rounded-xl bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : recentResources.length === 0 ? (
              /* EMPTY STATE */
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  📚
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-800">
                  No Recent Resources
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  New study resources will appear here.
                </p>
              </div>
            ) : (
              /* RESOURCE CARDS */
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recentResources.map((resource) => (
                  <article
                    key={resource._id}
                    className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:p-6"
                  >
                    {/* CATEGORY AND DATE */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {resource.category}
                      </span>

                      <span className="text-xs text-slate-400">
                        {formatDate(resource.createdAt)}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="mt-5 line-clamp-2 text-lg font-bold leading-6 text-slate-800 transition group-hover:text-blue-700">
                      {resource.title}
                    </h3>

                    {/* SUBJECT */}
                    {resource.subject && (
                      <p className="mt-2 line-clamp-1 text-sm font-medium text-slate-500">
                        {resource.subject}
                      </p>
                    )}

                    {/* DETAILS */}
                    <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>🏫</span>
                        <span className="line-clamp-1">
                          {resource.branch}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>📖</span>
                        <span>{resource.semester}</span>
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    {resource.description && (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                        {resource.description}
                      </p>
                    )}

                    {/* VIEW BUTTON */}
                    <div className="mt-auto pt-5">
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 active:bg-blue-800"
                      >
                        View Resource
                        <span>→</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* QUICK ACCESS */}
          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
                Quick Access
              </h2>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Continue your study journey.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "My Bookmarks",
                  description: "Access your saved study resources.",
                  icon: "🔖",
                  color: "purple",
                  path: "/bookmarks",
                  action: "Open",
                },
                {
                  title: "Study Planner",
                  description: "Plan your study schedule and tasks.",
                  icon: "📅",
                  color: "blue",
                  path: "/study-planner",
                  action: "Open",
                },
                {
                  title: "AI Study Assistant",
                  description: "Ask questions and get AI-powered help.",
                  icon: "🤖",
                  color: "indigo",
                  path: "/study-assistant",
                  action: "Open",
                },
                {
                  title: "AI Question Paper",
                  description: "Generate practice question papers with AI.",
                  icon: "📝",
                  color: "emerald",
                  path: "/ai-question-paper",
                  action: "Generate",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl transition group-hover:scale-110">
                    {item.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-800 transition group-hover:text-blue-700">
                    {item.title}
                  </h3>

                  <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                    {item.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-blue-600">
                    {item.action} →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* STUDY RESOURCE SHORTCUTS */}
          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
                Study Resources
              </h2>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Quickly access your study material.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                {
                  name: "Notes",
                  icon: "📘",
                  path: "/notes",
                  color: "blue",
                },
                {
                  name: "PYQ",
                  icon: "📄",
                  path: "/pyq",
                  color: "orange",
                },
                {
                  name: "Syllabus",
                  icon: "📚",
                  path: "/syllabus",
                  color: "purple",
                },
                {
                  name: "Ebooks",
                  icon: "📖",
                  path: "/ebooks",
                  color: "emerald",
                },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl transition group-hover:scale-110">
                    {item.icon}
                  </div>

                  <p className="mt-3 font-bold text-slate-800 transition group-hover:text-blue-700">
                    {item.name}
                  </p>

                  <span className="mt-1 inline-block text-xs font-medium text-slate-400">
                    Explore →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* BROWSE BRANCH RESOURCES */}
          <section className="mt-10 overflow-hidden rounded-3xl border border-purple-100 bg-gradient-to-r from-white to-purple-50 p-6 text-center shadow-sm sm:p-9">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
              🎓
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-slate-800">
              Ready to Study?
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore branch-wise resources and find the study material you
              need for your semester.
            </p>

            <Link
              to="/branch-resources"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-purple-700"
            >
              Browse Branch Resources
              <span>→</span>
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}