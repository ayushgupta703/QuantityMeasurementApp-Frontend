const BASE_URL = "http://localhost:8081/api/v1/quantities";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
});

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
  const res = await fetch(`${BASE_URL}/convert`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// 🔹 Compare
export const compare = async (data) => {
  const res = await fetch(`${BASE_URL}/compare`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// 🔹 Add
export const add = async (data) => {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// 🔹 Subtract
export const subtract = async (data) => {
  const res = await fetch(`${BASE_URL}/subtract`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// 🔹 Divide
export const divide = async (data) => {
  const res = await fetch(`${BASE_URL}/divide`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export { buildPayload };