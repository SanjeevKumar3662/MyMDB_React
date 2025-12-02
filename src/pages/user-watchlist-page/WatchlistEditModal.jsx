import { useEffect, useState } from "react";
import {
  updateWatchlistEntry,
  deleteWatchlistEntry,
} from "../../utils/watchlist-funcions.js";

export default function WatchlistEditModal({
  isOpen,
  onClose,
  entry,
  onSaved,
}) {
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [score, setScore] = useState("");
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    if (entry) {
      setStatus(entry.status ?? "");
      setScore(entry.score ?? "");
      setProgress(entry.progress ?? 0);
      setNotes(entry.notes ?? "");
    } else {
      setStatus("");
      setScore("");
      setProgress(0);
      setNotes("");
    }
    setLoading(false);
  }, [isOpen, entry]);

  if (!isOpen) return null;

  const statuses = [
    "watching",
    "completed",
    "on_hold",
    "dropped",
    "plan_to_watch",
  ];

  async function handleSave() {
    if (!entry) return;

    const updates = {
      status,
      score: score === "" ? null : Number(score),
      progress: Number(progress || 0),
      notes,
    };

    try {
      const result = await updateWatchlistEntry(entry._id, updates);
      if (result) {
        // alert("Updated!");
        onSaved?.(result);
        onClose();
      } else {
        alert("Failed to update. Try again.");
      }
    } catch (err) {
      console.error("update error", err);
      alert("Error while updating.");
    }
  }

  async function handleDelete() {
    if (!entry) return;
    const ok = confirm("Remove this from your list?");
    if (!ok) return;

    try {
      const result = await deleteWatchlistEntry(entry._id);
      if (result) {
        onSaved?.(null);
        onClose();
      } else {
        alert("Failed to remove. Try again.");
      }
    } catch (err) {
      console.error("delete error", err);
      alert("Error while deleting.");
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-9999"
      onClick={onClose}
    >
      <div
        className="w-[95vw] max-w-[720px] bg-blue-400 text-white rounded-xl p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : !entry ? (
          <div className="p-6 text-center text-red-400">Entry not found.</div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between gap-3">
              <div>
                <div className="font-bold text-lg">
                  {entry.media?.title ?? entry.media?.name}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-xl px-5 rounded-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="mt-4">
              {/* Status */}
              <label className="block mb-2 font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 mb-4 rounded bg-[#111] text-white border border-[#2b2b2b] capitalize"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replaceAll("_", " ")}
                  </option>
                ))}
              </select>

              {/* Score */}
              <label className="block mb-2 font-medium">Score (0–10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full p-2 mb-4 rounded bg-[#111] text-white border border-[#2b2b2b]"
              />

              {/* Progress (TV only) */}
              {entry.media?.type === "tv" && (
                <>
                  <label className="block mb-2 font-medium">
                    Progress ({progress} / {entry.media.totalEpisodes ?? "?"})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={entry.media.totalEpisodes ?? undefined}
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    className="w-full p-2 mb-4 rounded bg-[#111] text-white border border-[#2b2b2b]"
                  />
                </>
              )}

              {/* Notes */}
              <label className="block mb-2 font-medium">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                className="w-full p-2 mb-4 rounded bg-[#111] text-white border border-[#2b2b2b]"
              ></textarea>

              {/* Footer Buttons */}
              <div className="flex justify-between gap-3">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-white rounded cursor-pointer"
                >
                  Delete
                </button>

                <div className="ml-auto flex gap-2">
                  <button
                    onClick={onClose}
                    className="px-3 py-2 border border-[#2b2b2b] rounded text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-2  text-white rounded cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
