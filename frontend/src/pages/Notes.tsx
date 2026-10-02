
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

  // Bookmark state
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

        setError(
          err.response?.data?.message || "Unable to load notes"
        );
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
        if (currentIds.includes(resourceId)) {
          return currentIds;
        }

        return [...currentIds, resourceId];
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
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              Loading notes...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Student Notes
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Semester-wise study notes and learning materials.
          </p>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ================= FILTERS ================= */}
        {resources.length > 0 && (
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
        )}

        {/* ================= FILTER SUMMARY ================= */}
        {resources.length > 0 && (
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-bold text-blue-600">
                {filteredResources.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {resources.length}
              </span>{" "}
              notes
            </p>

            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-left text-sm font-semibold text-blue-600 hover:text-blue-800 sm:text-right"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ================= NO NOTES ================= */}
        {resources.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <h2 className="text-xl font-semibold text-gray-800">
              No notes uploaded yet.
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Notes uploaded by the admin will appear here.
            </p>
          </div>
        ) : filteredResources.length === 0 ? (

          /* ================= NO SEARCH RESULT ================= */
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <h2 className="text-xl font-semibold text-gray-800">
              No matching notes found.
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try another search, branch, semester, or category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              Show All Notes
            </button>
          </div>

        ) : (

          /* ================= NOTES CARDS ================= */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <article
                key={resource._id}
                className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
              >

                {/* Title + Category */}
                <div className="flex items-start justify-between gap-3">
                  <h2 className="min-w-0 break-words text-lg font-bold text-gray-900 sm:text-xl">
                    {resource.title}
                  </h2>

                  <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Notes
                  </span>
                </div>

                {/* Semester */}
                {resource.semester && (
                  <p className="mt-4 text-sm font-semibold text-blue-600">
                    Semester: {resource.semester}
                  </p>
                )}

                {/* Subject */}
                {resource.subject && (
                  <p className="mt-2 text-sm text-gray-600">
                    Subject: {resource.subject}
                  </p>
                )}

                {/* Branch */}
                {resource.branch && (
                  <p className="mt-2 text-sm text-gray-600">
                    Branch: {resource.branch}
                  </p>
                )}

                {/* Description */}
                {resource.description && (
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">
                    {resource.description}
                  </p>
                )}

                {/* File name */}
                {resource.fileName && (
                  <p className="mt-4 truncate text-sm text-gray-500">
                    File: {resource.fileName}
                  </p>
                )}

                {/* ================= ACTIONS ================= */}
                <div className="mt-auto pt-5">

                  {/* Bookmark */}
                  <div className="w-full">
                    <BookmarkButton
                      resourceId={resource._id}
                      bookmarked={bookmarkedIds.includes(
                        resource._id
                      )}
                      onChange={handleBookmarkChange}
                    />
                  </div>

                  {/* View + Download */}
                  <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row">
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 sm:flex-1"
                    >
                      View PDF
                    </a>

                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={resource.fileName || true}
                      className="w-full rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800 sm:flex-1"
                    >
                      Download
                    </a>
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

