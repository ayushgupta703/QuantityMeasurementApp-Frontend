const BASE_URL = "http://localhost:8081";

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
};

export const registerUser = async (data) => {
    const res = await fetch("http://localhost:8081/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  
    if (!res.ok) {
      const error = await res.text(); // backend message
      throw new Error(error || "Signup failed");
    }
  
    return res.json();
  };