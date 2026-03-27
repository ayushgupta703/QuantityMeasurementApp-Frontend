import { request } from "../api/apiClient.js";

export async function registerUser(user) {
  return request("/users", "POST", user);
}

export async function loginUser(email, password) {
  const users = await request(`/users?email=${email}`);

  if (!users.length) throw new Error("User not found");

  const user = users[0];

  if (user.password !== password) {
    throw new Error("Invalid credentials");
  }

  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("jwtToken", "mock-jwt-token-pending-backend");

  return user;
}