import { MEASUREMENT_SERVICE_URL, apiFetch } from "../config/api";

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
  return await apiFetch(`${MEASUREMENT_SERVICE_URL}/operation/convert`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// 🔹 Compare
export const compare = async (data) => {
  return await apiFetch(`${MEASUREMENT_SERVICE_URL}/operation/compare`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// 🔹 Add
export const add = async (data) => {
  return await apiFetch(`${MEASUREMENT_SERVICE_URL}/operation/add`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// 🔹 Subtract
export const subtract = async (data) => {
  return await apiFetch(`${MEASUREMENT_SERVICE_URL}/operation/subtract`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// 🔹 Divide
export const divide = async (data) => {
  return await apiFetch(`${MEASUREMENT_SERVICE_URL}/operation/divide`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// 🔹 All history (logged-in user)
export const getAllHistory = async () => {
  return await apiFetch(`${MEASUREMENT_SERVICE_URL}/history`, {
    method: "GET"
  });
};

// 🔹 History by Operation
export const getHistoryByOperation = async (operation) => {
  return await apiFetch(`${MEASUREMENT_SERVICE_URL}/history/operation/${operation}`, {
    method: "GET"
  });
};

// 🔹 History by Measurement Type
export const getHistoryByType = async (type) => {
  return await apiFetch(`${MEASUREMENT_SERVICE_URL}/history/type/${type}`, {
    method: "GET"
  });
};

// 🔹 Operation Count
export const getOperationCount = async (operation) => {
  return await apiFetch(`${MEASUREMENT_SERVICE_URL}/count/${operation}`, {
    method: "GET"
  });
};

export { buildPayload };