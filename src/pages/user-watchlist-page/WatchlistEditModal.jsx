import { useEffect, useState } from "react";
import {
  updateWatchlistEntry,
  deleteWatchlistEntry,
} from "../../utils/watchlist-funcions.js";

/**
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - entry: watchlist entry object (full entry)
 * - onSaved: (updatedEntry) => void   // optional callback to refresh parent
 */
export default function WatchlistEditModal({
  isOpen,
  onClose,
  entry,
  onSaved,
}) {
  const [loading, setLoading] = useState(true);

  // Local editable states - MUST NOT USE entry
  const [status, setStatus] = useState("");
  const [score, setScore] = useState("");
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    // initialize local fields from entry
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
        // alert("Removed!");
        onSaved?.(null); // notify parent that entry is gone
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
      className="watchlist-modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        className="watchlist-modal"
        style={{
          width: "min(720px, 95vw)",
          background: "#0b0b0b",
          color: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : !entry ? (
          <div className="p-6 text-center text-red-400">Entry not found.</div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.125rem" }}>
                  {entry.media?.title ?? entry.media?.name}
                </div>
                {/* <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                  {entry.media?.type}
                </div> */}
              </div>
              <button
                onClick={onClose}
                style={{
                  // background: "transparent",
                  border: "none",
                  // color: "#9ca3af",s
                  cursor: "pointer",
                }}
                className="text-xl px-5 rounded-2xl"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="block mb-2 font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  background: "#111",
                  color: "white",
                  border: "1px solid #2b2b2b",
                }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replaceAll("_", " ")}
                  </option>
                ))}
              </select>

              <label className="block mb-2 font-medium">Score (0–10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  background: "#111",
                  color: "white",
                  border: "1px solid #2b2b2b",
                }}
              />

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
                    className="w-full border p-2 rounded mb-4"
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 6,
                      background: "#111",
                      color: "white",
                      border: "1px solid #2b2b2b",
                    }}
                  />
                </>
              )}

              <label className="block mb-2 font-medium">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                rows="4"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  background: "#111",
                  color: "white",
                  border: "1px solid #2b2b2b",
                }}
              ></textarea>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <button
                  onClick={handleDelete}
                  className="px-4 py-2"
                  style={{
                    background: "#b91c1c",
                    color: "white",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>

                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  <button
                    onClick={onClose}
                    style={{
                      background: "transparent",
                      color: "#9ca3af",
                      borderRadius: 6,
                      padding: "8px 12px",
                      border: "1px solid #2b2b2b",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      background: "#0369a1",
                      color: "white",
                      borderRadius: 6,
                      padding: "8px 12px",
                      border: "none",
                      cursor: "pointer",
                    }}
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
