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
  subject?: string;
  semester: string;
  fileUrl: string;
  fileName?: string;
  createdAt: string;
}

export default function Notes() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All Branches");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Load notes
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/api/resources/category/Notes");

        const notesOnly = (res.data.resources || []).filter(
          (resource: Resource) =>
            resource.category?.trim().toLowerCase() === "notes"
        );

        setResources(notesOnly);
      } catch (err: any) {
        console.error("Notes loading error:", err);
        setError(err.response?.data?.message || "Unable to load notes");
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Load bookmarks
  useEffect(() => {
    const loadBookmarks = async () => {
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

        setBookmarkedIds(res.data.resourceIds || []);
      } catch (err) {
        console.error("Bookmark loading error:", err);
      }
    };

    loadBookmarks();
  }, []);

  // Bookmark change
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

  // Filter resources
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

  // Clear filters
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

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="font-semibold text-slate-600">
              Loading your notes...
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
        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-7 text-white shadow-lg shadow-blue-100 sm:p-10">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              Student Resources Hub
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Student Notes
            </h1>

            <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
              Explore semester-wise study notes and learning materials
              to make your preparation easier.
            </p>

            <div className="mt-6 inline-flex items-center rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold">
              {resources.length} Notes Available
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
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
              <span className="font-bold text-blue-700">
                {filteredResources.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {resources.length}
              </span>{" "}
              notes
            </p>

            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-left text-sm font-bold text-blue-600 transition hover:text-blue-800 sm:text-right"
              >
                Clear all filters →
              </button>
            )}
          </div>
        )}

        {/* NO NOTES */}
        {resources.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              No notes uploaded yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Notes uploaded by the admin will appear here.
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          /* NO SEARCH RESULT */
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              No matching notes found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try another search, branch, semester, or category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Show All Notes
            </button>
          </div>
        ) : (
          /* NOTES CARDS */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <article
                key={resource._id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
              >
                {/* CARD TOP */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

                <div className="flex flex-1 flex-col p-5 sm:p-6">

                  {/* TITLE + BADGE */}
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 break-words text-lg font-extrabold leading-7 text-slate-900 transition group-hover:text-blue-700 sm:text-xl">
                      {resource.title}
                    </h2>

                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                      NOTES
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
                        <span className="text-right font-bold text-blue-700">
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
                    <p
                      className="mt-4 truncate text-xs text-slate-400"
                      title={resource.fileName}
                    >
                      File: {resource.fileName}
                    </p>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-auto pt-6">

                    {/* BOOKMARK */}
                    <div className="rounded-xl border border-slate-200 p-2 transition hover:border-blue-200">
                      <BookmarkButton
                        resourceId={resource._id}
                        bookmarked={bookmarkedIds.includes(resource._id)}
                        onChange={handleBookmarkChange}
                      />
                    </div>

                    {/* VIEW + DOWNLOAD */}
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-blue-600 px-3 py-3 text-center text-sm font-bold text-white shadow-md shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700"
                      >
                        View PDF
                      </a>

                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={resource.fileName || true}
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