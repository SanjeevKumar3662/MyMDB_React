import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function UserWatchlistPage() {
  const { status } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const validTabs = [
    "watching",
    "completed",
    "on_hold",
    "dropped",
    "plan_to_watch",
  ];

  // Fetch list from backend
  useEffect(() => {
    setLoading(true);

    if (!validTabs.includes(status)) return;

    fetch(`/api/list?status=${status}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  // Invalid tab
  if (!validTabs.includes(status)) {
    return (
      <div className="p-6 text-center text-red-500">
        Invalid category: {status}
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Top Tabs */}
      <div className="flex gap-4 border-b pb-2 mb-6 text-sm font-medium">
        {validTabs.map((tab) => (
          <Link
            key={tab}
            to={`/list/${tab}`}
            className={`capitalize pb-2 ${
              tab === status
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab.replace("_", " ")}
          </Link>
        ))}
      </div>

      <h1 className="text-2xl font-semibold mb-4 capitalize">
        {status.replace("_", " ")}
      </h1>

      {/* List */}
      {items.length === 0 ? (
        <div className="text-gray-500">Nothing here yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((entry, index) => (
            <div
              key={entry._id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
            >
              {/* Poster */}
              <img
                src={`https://image.tmdb.org/t/p/w92${entry.media.posterPath}`}
                alt={entry.media.title}
                className="w-20 rounded"
              />

              {/* Row content */}
              <div className="flex-1">
                {/* Title */}
                <div className="font-semibold text-lg">
                  {index + 1}. {entry.media.title}
                </div>

                <div className="text-xs text-gray-500 uppercase">
                  {entry.media.type}
                </div>

                {/* Score */}
                <div className="mt-1 text-sm">
                  Score:{" "}
                  {entry.score !== null ? (
                    <span className="font-bold">{entry.score}</span>
                  ) : (
                    "-"
                  )}
                </div>

                {/* Progress */}
                {entry.media.type === "tv" && (
                  <div className="text-sm text-gray-600">
                    Progress: {entry.progress} /{" "}
                    {entry.media.totalEpisodes ?? "?"}
                  </div>
                )}

                {/* Tags */}
                {entry.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-200 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit button */}
              <Link
                to={`/list/edit/${entry._id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
