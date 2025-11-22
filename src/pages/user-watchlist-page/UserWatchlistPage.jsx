import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getWatchlist } from "../../utils/watchlist-funcions";
import WatchlistEditModal from "../../pages/user-watchlist-page/WatchlistEditModal";

export default function UserWatchlistPage() {
  const { status } = useParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const validTabs = [
    "watching",
    "completed",
    "on_hold",
    "dropped",
    "plan_to_watch",
  ];
  // console.log(items);
  // Fetch watchlist for this tab
  useEffect(() => {
    async function load() {
      setLoading(true);

      if (!validTabs.includes(status)) return;

      const data = await getWatchlist(status);
      setItems(data.items || []);

      setLoading(false);
    }

    load();
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
  // console.log(items);
  return (
    <div className="max-w-5xl mx-auto p-4 text-white">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800 pb-2 mb-6 text-sm font-medium">
        {validTabs.map((tab) => (
          <Link
            key={tab}
            to={`/list/${tab}`}
            className={`capitalize pb-2 ${
              tab === status
                ? "border-b-4 border-blue-500 text-blue-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.replaceAll("_", " ")}
          </Link>
        ))}
      </div>

      <h1 className="text-2xl font-semibold mb-4 capitalize">
        {status.replaceAll("_", " ")}
      </h1>

      {/* EMPTY */}
      {items.length === 0 ? (
        <div className="text-gray-500">Nothing here yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((entry, index) => (
            <div
              key={entry._id}
              className="flex items-center gap-4 p-4 bg-[#0e0e0e] rounded-lg border border-gray-800"
            >
              <span>{index + 1}</span>

              {/* Poster */}
              <Link to={`/${entry.media.type}_details/${entry.media.tmdbId}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w154${entry.media.posterPath}`}
                  className="w-[70px] rounded"
                  alt={entry.media.title}
                />
              </Link>

              <div className="flex-1">
                <Link to={`/${entry.media.type}_details/${entry.media.tmdbId}`}>
                  <span className="font-semibold text-lg text-blue-500">
                    {entry.media.title}
                  </span>
                </Link>

                <div className="text-xs text-gray-500 uppercase">
                  {entry.media.type}
                </div>

                <div className="text-sm">
                  Score:{" "}
                  {entry.score !== null ? (
                    <span className="font-bold">{entry.score}</span>
                  ) : (
                    "-"
                  )}
                </div>

                {entry.media.type === "tv" && (
                  <div className="text-sm text-gray-400">
                    Progress: {entry.progress} /{" "}
                    {entry.media.totalEpisodes ?? "?"}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  {entry.notes === "" ? "Add Notes" : entry.notes}
                </div>
              </div>

              {/* Edit button -> opens modal */}
              <button
                onClick={() => {
                  setSelectedEntry(entry);
                  setModalOpen(true);
                }}
                className="hover:text-blue-300 text-sm font-medium p-4 rounded-xl text-white"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/*  EDIT MODAL */}
      <WatchlistEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        entry={selectedEntry}
        onSaved={(updated) => {
          // If deleted:
          if (!updated) {
            setItems((prev) => prev.filter((i) => i._id !== selectedEntry._id));
            return;
          }

          // if status change , filter it out
          // console.log("updated", updated);

          if (status !== updated.entry.status) {
            setItems((prev) =>
              prev.filter((item) => item._id !== updated.entry._id)
            );
            return;
          }
          // updated.entry._id

          // If updated:
          setItems((prev) =>
            prev.map((item) =>
              item._id === updated.entry._id
                ? { ...item, ...updated.entry }
                : item
            )
          );
          // console.log("items", updated.entry);
        }}
      />
    </div>
  );
}
