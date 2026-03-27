import CONFIG from "../config.js";

export async function request(endpoint, method = "GET", data = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };

  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${CONFIG.BASE_URL}${endpoint}`, options);

  if (!res.ok) throw new Error("API Error");

  return res.json();
}