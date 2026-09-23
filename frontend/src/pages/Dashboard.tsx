
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
        const response =
          await api.get<BookmarkResponse>("/api/bookmarks", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        setBookmarkCount(
          response.data?.resources?.length || 0
        );
      } catch (error) {
        console.error(
          "Dashboard bookmark loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    const loadRecentResources = async () => {
      try {
        const response =
          await api.get<RecentResourcesResponse>(
            "/api/resources/recent?limit=6"
          );

        setRecentResources(
          response.data?.resources || []
        );
      } catch (error) {
        console.error(
          "Recently added resources loading error:",
          error
        );
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
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl">

          {/* WELCOME SECTION */}

          <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 lg:p-10 text-white shadow-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm font-medium text-blue-100">
                  Student Dashboard
                </p>

                <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold">
                  Welcome, {firstName}!
                </h1>

                <p className="mt-3 max-w-2xl text-sm sm:text-base text-blue-100">
                  Manage your saved resources, study planner
                  and AI learning tools from one place.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl bg-white/15 p-5 text-center backdrop-blur-sm">
            

                <p className="mt-2 text-sm font-semibold">
                  Keep Learning
                </p>
              </div>

            </div>
          </section>


          {/* PROFILE + STATS */}

          <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* PROFILE */}

            <div className="rounded-2xl bg-white p-6 shadow-lg md:col-span-2">
              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                  {firstName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-gray-800">
                    {displayName}
                  </h2>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {user.email || "Student account"}
                  </p>

                  {user.role && (
                    <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {user.role}
                    </span>
                  )}
                </div>

              </div>
            </div>


            {/* BOOKMARK STAT */}

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Saved Resources
                  </p>

                  <p className="mt-2 text-4xl font-bold text-purple-700">
                    {loading ? "..." : bookmarkCount}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Bookmarked resources
                  </p>
                </div>

               

              </div>
            </div>

          </section>


          {/* RECENTLY ADDED RESOURCES */}

          <section className="mt-8">

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Recently Added
                </h2>

                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Check out the latest study resources
                </p>
              </div>

              <Link
                to="/notes"
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                View All Resources →
              </Link>
            </div>


            {recentLoading ? (

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl bg-white p-6 shadow-md"
                  >
                    <div className="h-5 w-24 rounded bg-gray-200" />

                    <div className="mt-4 h-6 w-3/4 rounded bg-gray-200" />

                    <div className="mt-3 h-4 w-full rounded bg-gray-200" />

                    <div className="mt-2 h-4 w-2/3 rounded bg-gray-200" />

                    <div className="mt-5 h-10 w-full rounded-xl bg-gray-200" />
                  </div>
                ))}

              </div>

            ) : recentResources.length === 0 ? (

              <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              

                <h3 className="mt-3 text-lg font-bold text-gray-800">
                  No Recent Resources
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  New study resources will appear here.
                </p>
              </div>

            ) : (

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {recentResources.map((resource) => (

                  <div
                    key={resource._id}
                    className="group flex flex-col rounded-2xl bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* CATEGORY + DATE */}

                    <div className="flex items-center justify-between gap-3">

                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {resource.category}
                      </span>

                      <span className="text-xs text-gray-400">
                        {formatDate(resource.createdAt)}
                      </span>

                    </div>


                    {/* TITLE */}

                    <h3 className="mt-4 line-clamp-2 text-lg font-bold text-gray-800 transition group-hover:text-blue-700">
                      {resource.title}
                    </h3>


                    {/* SUBJECT */}

                    {resource.subject && (
                      <p className="mt-2 line-clamp-1 text-sm font-medium text-gray-600">
                        {resource.subject}
                      </p>
                    )}


                    {/* RESOURCE DETAILS */}

                    <div className="mt-4 space-y-2 text-sm text-gray-500">

                      <div className="flex items-center gap-2">
                        <span></span>
                        <span className="line-clamp-1">
                          {resource.branch}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span></span>
                        <span>
                          {resource.semester}
                        </span>
                      </div>

                    </div>


                    {/* ACTION */}

                    <div className="mt-5 pt-1">

                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Resource →
                      </a>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* QUICK ACTIONS */}

          <section className="mt-8">

            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Quick Access
              </h2>

              <p className="mt-1 text-sm sm:text-base text-gray-500">
                Continue your study journey
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {/* BOOKMARKS */}

              <Link
                to="/bookmarks"
                className="group rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
              

                <h3 className="mt-4 text-lg font-bold text-gray-800 group-hover:text-purple-700">
                  My Bookmarks
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Access your saved study resources.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-purple-600">
                  Open →
                </span>
              </Link>


              {/* STUDY PLANNER */}

              <Link
                to="/study-planner"
                className="group rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
              

                <h3 className="mt-4 text-lg font-bold text-gray-800 group-hover:text-blue-700">
                  Study Planner
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Plan your study schedule and tasks.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                  Open →
                </span>
              </Link>


              {/* AI ASSISTANT */}

              <Link
                to="/study-assistant"
                className="group rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
               

                <h3 className="mt-4 text-lg font-bold text-gray-800 group-hover:text-indigo-700">
                  AI Study Assistant
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Ask questions and get AI-powered help.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-indigo-600">
                  Open →
                </span>
              </Link>


              {/* AI QUESTION PAPER */}

              <Link
                to="/ai-question-paper"
                className="group rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
             
                <h3 className="mt-4 text-lg font-bold text-gray-800 group-hover:text-green-700">
                  AI Question Paper
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Generate practice question papers with AI.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-green-600">
                  Generate →
                </span>
              </Link>

            </div>
          </section>


          {/* RESOURCE SHORTCUTS */}

          <section className="mt-8">

            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Study Resources
              </h2>

              <p className="mt-1 text-sm sm:text-base text-gray-500">
                Quickly access your study material
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

              <Link
                to="/notes"
                className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
              

                <p className="mt-3 font-bold text-gray-800">
                  Notes
                </p>
              </Link>


              <Link
                to="/pyq"
                className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
             

                <p className="mt-3 font-bold text-gray-800">
                  PYQ
                </p>
              </Link>


              <Link
                to="/syllabus"
                className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
             

                <p className="mt-3 font-bold text-gray-800">
                  Syllabus
                </p>
              </Link>


              <Link
                to="/ebooks"
                className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
              

                <p className="mt-3 font-bold text-gray-800">
                  Ebooks
                </p>
              </Link>

            </div>
          </section>


          {/* BROWSE RESOURCES */}

          <section className="mt-8 rounded-2xl bg-white p-6 sm:p-8 text-center shadow-lg">

          

            <h2 className="mt-3 text-2xl font-bold text-gray-800">
              Ready to Study?
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-gray-500">
              Explore branch-wise resources and find the
              study material you need.
            </p>

            <Link
              to="/branch-resources"
              className="mt-5 inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              Browse Branch Resources
            </Link>

          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}