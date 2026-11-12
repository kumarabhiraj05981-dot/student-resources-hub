import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import BookmarkButton from "../components/bookmarks/BookmarkButton";
import ResourceFilters from "../components/resources/ResourceFilters";

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
}

export default function Ebooks() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All Branches");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  // LOAD E-BOOKS
  useEffect(() => {
    const loadEbooks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/api/resources/category/Ebooks");

        const allResources = Array.isArray(res.data?.resources)
          ? res.data.resources
          : [];

        const ebooksOnly = allResources.filter((item: Resource) => {
          const category = item.category?.trim().toLowerCase();

          return (
            category === "ebooks" ||
            category === "e-books" ||
            category === "e-book"
          );
        });

        setResources(ebooksOnly);
      } catch (err: any) {
        console.error("E-books loading error:", err.response?.data || err);

        setError(
          err.response?.data?.message ||
            "Unable to load e-books. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEbooks();
  }, []);

  // LOAD BOOKMARK IDS
  useEffect(() => {
    const loadBookmarkIds = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setBookmarkedIds([]);
        return;
      }

      try {
        const res = await api.get("/api/bookmarks/ids", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookmarkedIds(
          Array.isArray(res.data?.resourceIds)
            ? res.data.resourceIds
            : []
        );
      } catch (err: any) {
        console.error("Bookmark IDs loading error:", err.response?.data || err);
        setBookmarkedIds([]);
      }
    };

    loadBookmarkIds();
  }, []);

  // BOOKMARK CHANGE
  const handleBookmarkChange = (
    resourceId: string,
    bookmarked: boolean
  ) => {
    setBookmarkedIds((currentIds) => {
      if (bookmarked) {
        return currentIds.includes(resourceId)
          ? currentIds
          : [...currentIds, resourceId];
      }

      return currentIds.filter((id) => id !== resourceId);
    });
  };

  // FILTER RESOURCES
  const filteredResources = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const title = resource.title?.toLowerCase() || "";
      const description = resource.description?.toLowerCase() || "";
      const subject = resource.subject?.toLowerCase() || "";
      const semester = resource.semester?.toLowerCase() || "";
      const branch = resource.branch?.toLowerCase() || "";
      const fileName = resource.fileName?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        description.includes(searchText) ||
        subject.includes(searchText) ||
        semester.includes(searchText) ||
        branch.includes(searchText) ||
        fileName.includes(searchText);

      const matchesBranch =
        branchFilter === "All Branches" ||
        resource.branch?.trim().toLowerCase() ===
          branchFilter.trim().toLowerCase();

      const matchesSemester =
        semesterFilter === "All Semesters" ||
        resource.semester?.trim() === semesterFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        resource.category?.trim().toLowerCase() ===
          categoryFilter.trim().toLowerCase();

      return (
        matchesSearch &&
        matchesBranch &&
        matchesSemester &&
        matchesCategory
      );
    });
  }, [
    resources,
    search,
    branchFilter,
    semesterFilter,
    categoryFilter,
  ]);

  // CLEAR FILTERS
  const clearFilters = () => {
    setSearch("");
    setBranchFilter("All Branches");
    setSemesterFilter("All Semesters");
    setCategoryFilter("All Categories");
  };

  const filtersActive =
    search.trim() !== "" ||
    branchFilter !== "All Branches" ||
    semesterFilter !== "All Semesters" ||
    categoryFilter !== "All Categories";

  // LOADING
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
              📚
            </div>

            <p className="text-lg font-bold text-slate-800">
              Loading E-Books...
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we prepare your study materials.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 p-6 text-white shadow-lg sm:p-9">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 right-32 h-48 w-48 rounded-full bg-white/10" />

          <div className="relative z-10">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white">
              STUDENT RESOURCES HUB
            </span>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Student E-Books
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
                  Explore semester-wise books, reference materials and
                  digital study resources in one place.
                </p>
              </div>

              <div className="w-fit rounded-2xl border border-white/20 bg-white/15 px-5 py-3 backdrop-blur-sm">
                <p className="text-xs font-medium text-emerald-50">
                  Available E-Books
                </p>
                <p className="mt-1 text-3xl font-extrabold">
                  {resources.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* FILTERS */}
        {resources.length > 0 && (
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <ResourceFilters
              search={search}
              branch={branchFilter}
              semester={semesterFilter}
              category={categoryFilter}
              onSearchChange={setSearch}
              onBranchChange={setBranchFilter}
              onSemesterChange={setSemesterFilter}
              onCategoryChange={setCategoryFilter}
              onClear={clearFilters}
            />
          </div>
        )}

        {/* FILTER SUMMARY */}
        {resources.length > 0 && (
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-bold text-emerald-700">
                {filteredResources.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {resources.length}
              </span>{" "}
              E-Books
            </p>

            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-left text-sm font-semibold text-emerald-700 transition hover:text-emerald-900 sm:text-right"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* NO E-BOOKS */}
        {resources.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-4xl">
              📚
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              No E-Books Uploaded Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              E-Books uploaded by the admin will appear here. Please check
              again later.
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          /* NO MATCHING RESULTS */
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-4xl">
              🔍
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              No Matching E-Books Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try another search, branch, semester or category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Show All E-Books
            </button>
          </div>
        ) : (
          /* E-BOOK CARDS */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => {
              const isBookmarked = bookmarkedIds.includes(resource._id);

              return (
                <article
                  key={resource._id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                >
                  {/* CARD TOP */}
                  <div className="h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-400" />

                  <div className="flex flex-1 flex-col p-5 sm:p-6">

                    {/* TITLE + CATEGORY */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl transition group-hover:bg-emerald-100">
                          📗
                        </div>

                        <div className="min-w-0">
                          <h2 className="break-words text-lg font-bold leading-6 text-slate-800 transition group-hover:text-emerald-700 sm:text-xl">
                            {resource.title}
                          </h2>

                          <p className="mt-1 text-xs font-medium text-slate-400">
                            Digital Study Material
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        E-Book
                      </span>
                    </div>

                    {/* DETAILS */}
                    {(resource.semester ||
                      resource.subject ||
                      resource.branch) && (
                      <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
                        {resource.semester && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Semester
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {resource.semester}
                            </p>
                          </div>
                        )}

                        {resource.subject && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Subject
                            </p>
                            <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                              {resource.subject}
                            </p>
                          </div>
                        )}

                        {resource.branch && (
                          <div className="col-span-2 border-t border-slate-200 pt-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Branch
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {resource.branch}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* DESCRIPTION */}
                    {resource.description && (
                      <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">
                        {resource.description}
                      </p>
                    )}

                    {/* FILE NAME */}
                    {resource.fileName && (
                      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                          📄
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                            E-Book File
                          </p>

                          <p
                            className="mt-1 truncate text-sm font-medium text-slate-700"
                            title={resource.fileName}
                          >
                            {resource.fileName}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="mt-auto pt-5">
                      <BookmarkButton
                        resourceId={resource._id}
                        bookmarked={isBookmarked}
                        onChange={handleBookmarkChange}
                      />

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 active:scale-[0.98]"
                        >
                          <span>↗</span>
                          Open PDF
                        </a>

                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={resource.fileName || undefined}
                          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-3 py-3 text-sm font-bold text-white shadow-sm transition hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98]"
                        >
                          <span>↓</span>
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}