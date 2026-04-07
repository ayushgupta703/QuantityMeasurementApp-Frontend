import { AUTH_SERVICE_URL, apiFetch } from "../config/api";

export const loginUser = async (data) => {
  return await apiFetch(`${AUTH_SERVICE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const registerUser = async (data) => {
  return await apiFetch(`${AUTH_SERVICE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};