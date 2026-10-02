import type { ChangeEvent } from "react";

interface ResourceFiltersProps {
  search: string;
  branch: string;
  semester: string;
  category: string;

  onSearchChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;

  branchOptions?: string[];
}

/* =========================================================
   DEFAULT BRANCHES
========================================================= */

const defaultBranches = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Leather Technology",
];

/* =========================================================
   SEMESTERS
========================================================= */

const semesters = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
];

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
];

/* =========================================================
   COMPONENT
========================================================= */

export default function ResourceFilters({
  search,
  branch,
  semester,
  category,
  onSearchChange,
  onBranchChange,
  onSemesterChange,
  onCategoryChange,
  onClear,
  branchOptions = defaultBranches,
}: ResourceFiltersProps) {
  /* =======================================================
     HANDLERS
  ======================================================= */

  const handleSearch = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onSearchChange(event.target.value);
  };

  const handleBranchChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    onBranchChange(event.target.value);
  };

  const handleSemesterChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    onSemesterChange(event.target.value);
  };

  const handleCategoryChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    onCategoryChange(event.target.value);
  };

  /* =======================================================
     ACTIVE FILTER CHECK
  ======================================================= */

  const hasFilters =
    search.trim() !== "" ||
    branch.trim() !== "" ||
    semester.trim() !== "" ||
    category.trim() !== "";

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="mb-5">

        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
          Find Resources
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Search and filter resources by branch, semester and category.
        </p>

      </div>

      {/* ===================================================
          FILTER GRID
      =================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* =================================================
            SEARCH
        ================================================= */}

        <div>

          <label
            htmlFor="resource-search"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            🔎 Search
          </label>

          <input
            id="resource-search"
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search resources..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* =================================================
            BRANCH
        ================================================= */}

        <div>

          <label
            htmlFor="resource-branch"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            🏫 Branch
          </label>

          <select
            id="resource-branch"
            value={branch}
            onChange={handleBranchChange}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >

            <option value="">
              All Branches
            </option>

            {branchOptions.map(
              (branchName) => (
                <option
                  key={branchName}
                  value={branchName}
                >
                  {branchName}
                </option>
              )
            )}

          </select>

        </div>

        {/* =================================================
            SEMESTER
        ================================================= */}

        <div>

          <label
            htmlFor="resource-semester"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            📚 Semester
          </label>

          <select
            id="resource-semester"
            value={semester}
            onChange={handleSemesterChange}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >

            <option value="">
              All Semesters
            </option>

            {semesters.map(
              (semesterNumber) => (
                <option
                  key={semesterNumber}
                  value={semesterNumber}
                >
                  Semester {semesterNumber}
                </option>
              )
            )}

          </select>

        </div>

        {/* =================================================
            CATEGORY
        ================================================= */}

        <div>

          <label
            htmlFor="resource-category"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            📂 Category
          </label>

          <select
            id="resource-category"
            value={category}
            onChange={handleCategoryChange}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >

            <option value="">
              All Categories
            </option>

            {categories.map(
              (categoryName) => (
                <option
                  key={categoryName}
                  value={categoryName}
                >
                  {categoryName}
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* ===================================================
          ACTIVE FILTERS
      =================================================== */}

      {hasFilters && (
        <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

          {/* FILTER BADGES */}

          <div className="flex flex-wrap gap-2">

            {search.trim() !== "" && (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                Search: {search}
              </span>
            )}

            {branch.trim() !== "" && (
              <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
                Branch: {branch}
              </span>
            )}

            {semester.trim() !== "" && (
              <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                Semester: {semester}
              </span>
            )}

            {category.trim() !== "" && (
              <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                Category: {category}
              </span>
            )}

          </div>

          {/* CLEAR BUTTON */}

          <button
            type="button"
            onClick={onClear}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 active:bg-gray-200 sm:w-auto"
          >
            Clear Filters
          </button>

        </div>
      )}

    </div>
  );
}