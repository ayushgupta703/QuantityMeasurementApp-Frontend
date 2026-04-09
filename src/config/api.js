// 🌐 Production URLs (from Vercel environment variables)
export const GATEWAY_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ API endpoints via Gateway
export const AUTH_API = `${GATEWAY_URL}/auth`;
export const MEASUREMENT_API = `${GATEWAY_URL}/api/v1/quantities`;

// 🔐 OAuth (direct to Auth Service)
export const OAUTH_URL = import.meta.env.VITE_OAUTH_BASE_URL;

/**
 * 🌐 Reusable fetch wrapper
 * - Injects JWT automatically
 * - Handles auth errors globally
 */
export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // 🔐 Attach JWT if present
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // ⚠️ Global error handling
  if (!res.ok) {
    if (
      (res.status === 401 || res.status === 403) &&
      !url.includes("/auth/login")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }

    const msg = await res.text();
    throw new Error(msg || "API request failed");
  }

  // ✅ Safe JSON parsing
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};