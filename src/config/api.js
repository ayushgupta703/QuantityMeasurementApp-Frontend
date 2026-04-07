export const GATEWAY_URL = "http://localhost:8082";
export const AUTH_SERVICE_URL = `${GATEWAY_URL}/auth-service`;
export const MEASUREMENT_SERVICE_URL = `${GATEWAY_URL}/measurement-service/api/v1/quantities`;

/**
 * A generalized, reusable fetch wrapper designed for the microservices environment.
 * It automatically injects JWT headers and centrally handles 401/403 unauthenticated scenarios.
 */
export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  // Attach token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers
  });

  // Handle errors uniquely for the application
  if (!res.ok) {
    // If it's a 401 or 403 and NOT a basic login request, clean token and redirect
    if ((res.status === 401 || res.status === 403) && !url.includes("/auth/login")) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Hard redirect, handles state purging
      throw new Error("Session expired. Please log in again.");
    }
    
    // Attempt backend message parse
    const msg = await res.text();
    throw new Error(msg || "API request failed");
  }

  // Parses normally or returns empty object for endpoints that don't return json
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};
