
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

  // ==============================
  // FILTERS
  // ==============================

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] =
    useState("All Branches");
  const [semesterFilter, setSemesterFilter] =
    useState("All Semesters");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  // ==============================
  // LOAD E-BOOKS
  // ==============================

  useEffect(() => {
    const loadEbooks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          "/api/resources/category/Ebooks"
        );

        console.log(
          "E-BOOKS API RESPONSE:",
          res.data
        );

        const allResources = Array.isArray(
          res.data?.resources
        )
          ? res.data.resources
          : [];

        const ebooksOnly = allResources.filter(
          (item: Resource) => {
            const category =
              item.category?.trim().toLowerCase();

            return (
              category === "ebooks" ||
              category === "e-books" ||
              category === "e-book"
            );
          }
        );

        console.log(
          "E-BOOKS FILTERED:",
          ebooksOnly
        );

        setResources(ebooksOnly);
      } catch (err: any) {
        console.error(
          "E-books loading error:",
          err.response?.data || err
        );

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

  // ==============================
  // LOAD BOOKMARK IDS
  // ==============================

  useEffect(() => {
    const loadBookmarkIds = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setBookmarkedIds([]);
        return;
      }

      try {
        const res = await api.get(
          "/api/bookmarks/ids",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookmarkedIds(
          Array.isArray(
            res.data?.resourceIds
          )
            ? res.data.resourceIds
            : []
        );
      } catch (err: any) {
        console.error(
          "Bookmark IDs loading error:",
          err.response?.data || err
        );

        setBookmarkedIds([]);
      }
    };

    loadBookmarkIds();
  }, []);

  // ==============================
  // BOOKMARK CHANGE
  // ==============================

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

  // ==============================
  // FILTER RESOURCES
  // ==============================

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
        resource.semester?.trim() ===
          semesterFilter;

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

  // ==============================
  // CLEAR FILTERS
  // ==============================

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

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <main className="min-h-screen bg-blue-50 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
            <div className="mb-4 text-5xl">
              📚
            </div>

            <p className="text-lg font-semibold text-gray-700">
              Loading E-Books...
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Please wait
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==============================
  // MAIN PAGE
  // ==============================

  return (
    <main className="min-h-screen bg-blue-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ==============================
            HEADER
        ============================== */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-700 sm:text-4xl">
            Student E-Books
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Semester-wise books and study materials
          </p>
        </div>

        {/* ==============================
            ERROR
        ============================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* ==============================
            FILTERS
        ============================== */}

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

        {/* ==============================
            FILTER SUMMARY
        ============================== */}

        {resources.length > 0 && (
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-bold text-green-700">
                {filteredResources.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {resources.length}
              </span>{" "}
              E-Book
              {resources.length !== 1
                ? "s"
                : ""}
            </p>

            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-left text-sm font-semibold text-green-700 hover:text-green-900 sm:text-right"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ==============================
            NO E-BOOKS
        ============================== */}

        {resources.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mb-4 text-5xl">
              📚
            </div>

            <p className="text-xl font-semibold text-gray-700">
              No E-Books uploaded yet.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              E-Books uploaded by the admin will
              appear here.
            </p>
          </div>

        ) : filteredResources.length === 0 ? (

          /* ==============================
             NO MATCHING RESULTS
          ============================== */

          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mb-4 text-5xl">
              🔍
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              No matching E-Books found.
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try another search, branch, semester,
              or category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 w-full rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
            >
              Show All E-Books
            </button>
          </div>

        ) : (

          /* ==============================
             E-BOOK CARDS
          ============================== */

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => {
              const isBookmarked =
                bookmarkedIds.includes(
                  resource._id
                );

              return (
                <article
                  key={resource._id}
                  className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
                >

                  {/* ==============================
                      TITLE + CATEGORY
                  ============================== */}

                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 break-words text-lg font-bold text-gray-800 sm:text-xl">
                      {resource.title}
                    </h2>

                    <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 sm:text-sm">
                      E-Book
                    </span>
                  </div>

                  {/* ==============================
                      SEMESTER
                  ============================== */}

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

                  {/* ==============================
                      SUBJECT
                  ============================== */}

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

                  {/* ==============================
                      BRANCH
                  ============================== */}

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

                  {/* ==============================
                      DESCRIPTION
                  ============================== */}

                  {resource.description && (
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">
                      {resource.description}
                    </p>
                  )}

                  {/* ==============================
                      FILE NAME
                  ============================== */}

                  {resource.fileName && (
                    <div className="mt-4 rounded-lg bg-gray-50 p-3">
                      <p className="mb-1 text-xs font-semibold text-gray-500">
                        E-BOOK FILE
                      </p>

                      <p
                        className="truncate text-sm text-gray-700"
                        title={resource.fileName}
                      >
                        {resource.fileName}
                      </p>
                    </div>
                  )}

                  {/* ==============================
                      ACTIONS
                  ============================== */}

                  <div className="mt-auto pt-5">

                    {/* BOOKMARK */}

                    <BookmarkButton
                      resourceId={resource._id}
                      bookmarked={isBookmarked}
                      onChange={
                        handleBookmarkChange
                      }
                    />

                    {/* OPEN + DOWNLOAD */}

                    <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row">

                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 sm:flex-1"
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
                        className="w-full rounded-lg bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700 active:bg-green-800 sm:flex-1"
                      >
                        Download
                      </a>

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
