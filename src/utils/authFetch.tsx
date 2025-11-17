// src/utils/authFetch.ts

/**
 * A typed wrapper around fetch that:
 * 1. Automatically includes credentials (cookies)
 * 2. Detects 401 (expired access token)
 * 3. Calls /refreshAccessToken automatically
 * 4. Retries the original request once
 */

export async function authFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const SERVER = import.meta.env.VITE_SERVER_URI;

  // Always include cookies
  const config: RequestInit = {
    ...options,
    credentials: "include",
  };

  // First attempt
  let res = await fetch(url, config);

  // If access token expired
  if (res.status === 401) {
    console.warn("Access token expired → attempting refresh...");

    const refreshRes = await fetch(`${SERVER}/api/v1/user/refreshAccessToken`, {
      method: "POST",
      credentials: "include",
    });

    // If refresh also fails → user must login again
    if (!refreshRes.ok) {
      console.warn("Refresh token expired → login required");
      return { ok: false, status: res.status, data: null };
    }

    console.log("Access token refreshed → retrying request...");

    // Retry the original request with new access token
    res = await fetch(url, config);
  }

  // Try to parse JSON — but safely
  let json: T | null = null;
  try {
    json = await res.json();
  } catch {}

  return { ok: res.ok, status: res.status, data: json };
}
