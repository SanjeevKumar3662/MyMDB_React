const SERVER_URI = import.meta.env.VITE_SERVER_URI;

export async function addToWatchlist(tmdbId, type) {
  try {
    const res = await fetch(`${SERVER_URI}/api/v1/watchlist`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tmdbId,
        type, // "movie" or "tv"
        status: "plan_to_watch", // optional default
        progress: 0,
      }),
    });

    const data = await res.json();
    console.log("data from watchlist-function", data);
    return data;
  } catch (err) {
    console.error("Error adding to watchlist:", err);
    return null;
  }
}

export async function getWatchlist(status) {
  try {
    const res = await fetch(`${SERVER_URI}/api/v1/watchlist?status=${status}`, {
      method: "GET",
      credentials: "include",
    });

    return await res.json();
  } catch (err) {
    console.error("Error fetching watchlist:", err);
    return { items: [] };
  }
}

export async function updateWatchlistEntry(id, updates) {
  try {
    const res = await fetch(`${SERVER_URI}/api/v1/watchlist/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    return await res.json();
  } catch (err) {
    console.error("Error updating entry:", err);
    return null;
  }
}

export async function deleteWatchlistEntry(id) {
  try {
    const res = await fetch(`${SERVER_URI}/api/v1/watchlist/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return await res.json();
  } catch (err) {
    console.error("Error deleting entry:", err);
    return null;
  }
}

export async function getWatchlistStats() {
  try {
    const res = await fetch(`${SERVER_URI}/api/v1/watchlist/stats`, {
      method: "GET",
      credentials: "include",
    });

    return await res.json();
  } catch (err) {
    console.error("Error fetching stats:", err);
    return {};
  }
}
