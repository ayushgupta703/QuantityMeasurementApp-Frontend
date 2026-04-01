const BASE_URL = "http://localhost:8081/api/v1/quantities";

const getOperationHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

const getHistoryHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("UNAUTHORIZED");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// 🔥 UPDATED payload builder (supports conversion properly)
const buildPayload = (
  value1,
  unit1,
  value2,
  unit2,
  measurementType,
  isConversion = false
) => ({
  thisQuantityDTO: {
    value: Number(value1),
    unit: unit1,
    measurementType
  },
  thatQuantityDTO: {
    value: isConversion ? 0 : Number(value2), // ✅ important
    unit: unit2,
    measurementType
  }
});

// 🔹 Convert
export const convert = async (data) => {
  const res = await fetch(`${BASE_URL}/operation/convert`, {
    method: "POST",
    headers: getOperationHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// 🔹 Compare
export const compare = async (data) => {
  const res = await fetch(`${BASE_URL}/operation/compare`, {
    method: "POST",
    headers: getOperationHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// 🔹 Add
export const add = async (data) => {
  const res = await fetch(`${BASE_URL}/operation/add`, {
    method: "POST",
    headers: getOperationHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// 🔹 Subtract
export const subtract = async (data) => {
  const res = await fetch(`${BASE_URL}/operation/subtract`, {
    method: "POST",
    headers: getOperationHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// 🔹 Divide
export const divide = async (data) => {
  const res = await fetch(`${BASE_URL}/operation/divide`, {
    method: "POST",
    headers: getOperationHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// 🔹 All history (logged-in user)
export const getAllHistory = async () => {
  const res = await fetch(`${BASE_URL}/history`, {
    method: "GET",
    headers: getHistoryHeaders()
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("UNAUTHORIZED");
    const msg = await res.text();
    throw new Error(msg || "Failed to fetch all history");
  }
  return res.json();
};

// 🔹 History by Operation
export const getHistoryByOperation = async (operation) => {
  const res = await fetch(`${BASE_URL}/history/operation/${operation}`, {
    method: "GET",
    headers: getHistoryHeaders()
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("UNAUTHORIZED");
    const msg = await res.text();
    throw new Error(msg || "Failed to fetch history by operation");
  }
  return res.json();
};

// 🔹 History by Measurement Type
export const getHistoryByType = async (type) => {
  const res = await fetch(`${BASE_URL}/history/type/${type}`, {
    method: "GET",
    headers: getHistoryHeaders()
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("UNAUTHORIZED");
    const msg = await res.text();
    throw new Error(msg || "Failed to fetch history by type");
  }
  return res.json();
};

// 🔹 Operation Count
export const getOperationCount = async (operation) => {
  const res = await fetch(`${BASE_URL}/count/${operation}`, {
    method: "GET",
    headers: getHistoryHeaders()
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("UNAUTHORIZED");
    const msg = await res.text();
    throw new Error(msg || "Failed to fetch operation count");
  }
  return res.json();
};

export { buildPayload };