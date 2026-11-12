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

export default function PYQ() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All Branches");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // LOAD PYQS
  const loadPYQ = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/resources/category/PYQ");

      const data = response.data;

      if (!data?.success) {
        throw new Error(data?.message || "Unable to load PYQs");
      }

      const apiResources = Array.isArray(data.resources)
        ? data.resources
        : [];

      const pyqResources = apiResources.filter(
        (resource: Resource) =>
          String(resource.category || "").trim().toLowerCase() === "pyq"
      );

      setResources(pyqResources);
    } catch (err: any) {
      console.error("PYQ loading error:", err);

      setResources([]);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load PYQs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPYQ();
  }, []);

  // LOAD BOOKMARKS
  useEffect(() => {
    const loadBookmarks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setBookmarkedIds([]);
        return;
      }

      try {
        const response = await api.get("/api/bookmarks/ids", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookmarkedIds(response.data.resourceIds || []);
      } catch (err) {
        console.error("Bookmark loading error:", err);
      }
    };

    loadBookmarks();
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
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />

            <p className="font-semibold text-slate-600">
              Loading previous year questions...
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
        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-7 text-white shadow-lg shadow-orange-100 sm:p-10">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              Student Resources Hub
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Previous Year Questions
            </h1>

            <p className="mt-3 text-sm leading-6 text-orange-50 sm:text-base">
              Prepare smarter with semester-wise previous year
              question papers and practice materials.
            </p>

            <div className="mt-6 inline-flex items-center rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold">
              {resources.length} PYQs Available
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-700">{error}</p>

            <button
              type="button"
              onClick={loadPYQ}
              className="mt-3 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* FILTERS */}
        {resources.length > 0 && (
          <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
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
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-bold text-orange-600">
                {filteredResources.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {resources.length}
              </span>{" "}
              PYQs
            </p>

            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-left text-sm font-bold text-orange-600 transition hover:text-orange-800 sm:text-right"
              >
                Clear all filters →
              </button>
            )}
          </div>
        )}

        {/* NO PYQS */}
        {!error && resources.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              No PYQs uploaded yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Previous year question papers uploaded by the admin
              will appear here.
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          /* NO SEARCH RESULT */
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              No matching PYQs found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try another search, branch, semester, or category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:-translate-y-0.5 hover:bg-orange-700"
            >
              Show All PYQs
            </button>
          </div>
        ) : (
          /* PYQ CARDS */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <article
                key={resource._id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/60"
              >
                {/* CARD TOP */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400" />

                <div className="flex flex-1 flex-col p-5 sm:p-6">

                  {/* TITLE + BADGE */}
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 break-words text-lg font-extrabold leading-7 text-slate-900 transition group-hover:text-orange-700 sm:text-xl">
                      {resource.title}
                    </h2>

                    <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 ring-1 ring-orange-100">
                      PYQ
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  {resource.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                      {resource.description}
                    </p>
                  )}

                  {/* DETAILS */}
                  <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4">

                    {resource.semester && (
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-500">
                          Semester
                        </span>

                        <span className="text-right font-bold text-orange-700">
                          {resource.semester}
                        </span>
                      </div>
                    )}

                    {resource.subject && (
                      <div className="flex items-start justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-500">
                          Subject
                        </span>

                        <span className="max-w-[65%] break-words text-right font-semibold text-slate-800">
                          {resource.subject}
                        </span>
                      </div>
                    )}

                    {resource.branch && (
                      <div className="flex items-start justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-500">
                          Branch
                        </span>

                        <span className="max-w-[65%] break-words text-right font-semibold text-slate-800">
                          {resource.branch}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* FILE NAME */}
                  {resource.fileName && (
                    <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/60 p-3">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-600">
                        PDF File
                      </p>

                      <p
                        className="truncate text-sm font-medium text-slate-700"
                        title={resource.fileName}
                      >
                        {resource.fileName}
                      </p>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-auto pt-6">

                    {/* BOOKMARK */}
                    <div className="rounded-xl border border-slate-200 p-2 transition hover:border-orange-200">
                      <BookmarkButton
                        resourceId={resource._id}
                        bookmarked={bookmarkedIds.includes(resource._id)}
                        onChange={handleBookmarkChange}
                      />
                    </div>

                    {/* OPEN + DOWNLOAD */}
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-orange-600 px-3 py-3 text-center text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:-translate-y-0.5 hover:bg-orange-700"
                      >
                        Open PDF
                      </a>

                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={resource.fileName || undefined}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}