// src/utils/watchlistApi.js
import { authFetch } from "./authFetch.js";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

export async function addToWatchlist(tmdbId, type) {
  try {
    const { ok, status, data } = await authFetch(
      `${SERVER_URI}/api/v1/watchlist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tmdbId,
          type, // "movie" or "tv"
          status: "plan_to_watch", // optional default
          progress: 0,
        }),
      }
    );

    if (!ok) {
      console.error("addToWatchlist failed", status, data);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error adding to watchlist:", err);
    return null;
  }
}

export async function getWatchlist(statusFilter) {
  try {
    const { ok, status, data } = await authFetch(
      `${SERVER_URI}/api/v1/watchlist?status=${encodeURIComponent(
        statusFilter
      )}`,
      {
        method: "GET",
      }
    );

    if (!ok) {
      console.error("getWatchlist failed", status, data);
      return { items: [] };
    }
    return data;
  } catch (err) {
    console.error("Error fetching watchlist:", err);
    return { items: [] };
  }
}

export async function updateWatchlistEntry(id, updates) {
  try {
    const { ok, status, data } = await authFetch(
      `${SERVER_URI}/api/v1/watchlist/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!ok) {
      console.error("updateWatchlistEntry failed", status, data);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error updating entry:", err);
    return null;
  }
}

export async function deleteWatchlistEntry(id) {
  try {
    const { ok, status, data } = await authFetch(
      `${SERVER_URI}/api/v1/watchlist/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!ok) {
      console.error("deleteWatchlistEntry failed", status, data);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error deleting entry:", err);
    return null;
  }
}

export async function getWatchlistStats() {
  try {
    const { ok, status, data } = await authFetch(
      `${SERVER_URI}/api/v1/watchlist/stats`,
      {
        method: "GET",
      }
    );

    if (!ok) {
      console.error("getWatchlistStats failed", status, data);
      return {};
    }
    return data;
  } catch (err) {
    console.error("Error fetching stats:", err);
    return {};
  }
}
