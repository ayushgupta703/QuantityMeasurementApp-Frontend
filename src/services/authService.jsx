import { AUTH_API, apiFetch } from "../config/api";

// 🔐 Login User
export const loginUser = async (data) => {
  return await apiFetch(`${AUTH_API}/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// 📝 Register User
export const registerUser = async (data) => {
  return await apiFetch(`${AUTH_API}/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};