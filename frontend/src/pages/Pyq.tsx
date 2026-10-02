
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

  // Bookmark state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // ================= LOAD PYQS =================
  const loadPYQ = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/resources/category/PYQ"
      );

      const data = response.data;

      if (!data?.success) {
        throw new Error(
          data?.message || "Unable to load PYQs"
        );
      }

      const apiResources = Array.isArray(data.resources)
        ? data.resources
        : [];

      const pyqResources = apiResources.filter(
        (resource: Resource) =>
          String(resource.category || "")
            .trim()
            .toLowerCase() === "pyq"
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

  // ================= LOAD BOOKMARKS =================
  useEffect(() => {
    const loadBookmarks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setBookmarkedIds([]);
        return;
      }

      try {
        const response = await api.get(
          "/api/bookmarks/ids",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookmarkedIds(
          response.data.resourceIds || []
        );
      } catch (err) {
        console.error(
          "Bookmark loading error:",
          err
        );
      }
    };

    loadBookmarks();
  }, []);

  // ================= BOOKMARK CHANGE =================
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

      return currentIds.filter(
        (id) => id !== resourceId
      );
    });
  };

  // ================= FILTER =================
  const filteredResources = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return resources.filter((resource) => {
      const title =
        resource.title?.toLowerCase() || "";

      const description =
        resource.description?.toLowerCase() || "";

      const subject =
        resource.subject?.toLowerCase() || "";

      const semester =
        resource.semester?.toLowerCase() || "";

      const branch =
        resource.branch?.toLowerCase() || "";

      const fileName =
        resource.fileName?.toLowerCase() || "";

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

  // ================= CLEAR FILTERS =================
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

  // ================= LOADING =================
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              Loading PYQs...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ================= PAGE =================
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Previous Year Questions
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Semester-wise previous year question papers.
          </p>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={loadPYQ}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
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
              <span className="font-bold text-orange-600">
                {filteredResources.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {resources.length}
              </span>{" "}
              PYQs
            </p>

            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-left text-sm font-semibold text-orange-600 hover:text-orange-800 sm:text-right"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ================= NO PYQS ================= */}
        {!error && resources.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <h2 className="text-xl font-semibold text-gray-800">
              No PYQs uploaded yet.
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Previous year question papers uploaded
              by the admin will appear here.
            </p>
          </div>

        ) : filteredResources.length === 0 ? (

          /* ================= NO RESULT ================= */
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <h2 className="text-xl font-semibold text-gray-800">
              No matching PYQs found.
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try another search, branch, semester, or category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 w-full rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 sm:w-auto"
            >
              Show All PYQs
            </button>
          </div>

        ) : (

          /* ================= PYQ CARDS ================= */
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

                  <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                    PYQ
                  </span>
                </div>

                {/* Semester */}
                {resource.semester && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-blue-600">
                      Semester
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {resource.semester}
                    </p>
                  </div>
                )}

                {/* Subject */}
                {resource.subject && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-500">
                      Subject
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {resource.subject}
                    </p>
                  </div>
                )}

                {/* Branch */}
                {resource.branch && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-500">
                      Branch
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {resource.branch}
                    </p>
                  </div>
                )}

                {/* Description */}
                {resource.description && (
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">
                    {resource.description}
                  </p>
                )}

                {/* File */}
                {resource.fileName && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="mb-1 text-xs font-semibold text-gray-500">
                      PDF FILE
                    </p>

                    <p
                      className="truncate text-sm text-gray-700"
                      title={resource.fileName}
                    >
                      {resource.fileName}
                    </p>
                  </div>
                )}

                {/* ================= ACTIONS ================= */}
                <div className="mt-auto pt-5">

                  {/* Bookmark */}
                  <BookmarkButton
                    resourceId={resource._id}
                    bookmarked={bookmarkedIds.includes(
                      resource._id
                    )}
                    onChange={
                      handleBookmarkChange
                    }
                  />

                  {/* Open + Download */}
                  <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row">
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 sm:flex-1"
                    >
                      Open
                    </a>

                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={
                        resource.fileName ||
                        undefined
                      }
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

