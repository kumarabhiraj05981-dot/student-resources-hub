import { useState } from "react";
import api from "../../services/api";

interface BookmarkButtonProps {
  resourceId: string;
  bookmarked: boolean;
  onChange: (
    resourceId: string,
    bookmarked: boolean
  ) => void;
}

export default function BookmarkButton({
  resourceId,
  bookmarked,
  onChange,
}: BookmarkButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to bookmark resources.");
      return;
    }

    try {
      setLoading(true);

      if (bookmarked) {
        await api.delete(
          `/api/bookmarks/${resourceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        onChange(resourceId, false);
      } else {
        await api.post(
          `/api/bookmarks/${resourceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        onChange(resourceId, true);
      }
    } catch (error: any) {
      console.error("Bookmark error:", error);

      if (error.response?.status === 401) {
        alert("Please login first.");
      } else {
        alert(
          error.response?.data?.message ||
            "Unable to update bookmark."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBookmark}
      disabled={loading}
      title={
        bookmarked
          ? "Remove bookmark"
          : "Add bookmark"
      }
      className={[
        "flex w-full items-center justify-center gap-2",
        "rounded-lg border px-4 py-3",
        "text-sm font-semibold",
        "transition-all duration-200",
        "disabled:cursor-not-allowed",
        "disabled:opacity-60",

        bookmarked
          ? "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          : "border-gray-300 bg-white text-gray-700 hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-700",
      ].join(" ")}
    >
      <span className="text-xl leading-none">
        {bookmarked ? "★" : "☆"}
      </span>

      <span>
        {loading
          ? "Saving..."
          : bookmarked
          ? "Saved"
          : "Bookmark"}
      </span>
    </button>
  );
}