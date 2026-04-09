import { MEASUREMENT_API, apiFetch } from "../config/api";

// 🔥 Payload builder
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
    measurementType,
  },
  thatQuantityDTO: {
    value: isConversion ? 0 : Number(value2),
    unit: unit2,
    measurementType,
  },
});

// 🔹 Convert
export const convert = async (data) => {
  return await apiFetch(`${MEASUREMENT_API}/operation/convert`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// 🔹 Compare
export const compare = async (data) => {
  return await apiFetch(`${MEASUREMENT_API}/operation/compare`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// 🔹 Add
export const add = async (data) => {
  return await apiFetch(`${MEASUREMENT_API}/operation/add`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// 🔹 Subtract
export const subtract = async (data) => {
  return await apiFetch(`${MEASUREMENT_API}/operation/subtract`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// 🔹 Divide
export const divide = async (data) => {
  return await apiFetch(`${MEASUREMENT_API}/operation/divide`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// 🔹 All history
export const getAllHistory = async () => {
  return await apiFetch(`${MEASUREMENT_API}/history`, {
    method: "GET",
  });
};

// 🔹 History by Operation
export const getHistoryByOperation = async (operation) => {
  return await apiFetch(`${MEASUREMENT_API}/history/operation/${operation}`, {
    method: "GET",
  });
};

// 🔹 History by Type
export const getHistoryByType = async (type) => {
  return await apiFetch(`${MEASUREMENT_API}/history/type/${type}`, {
    method: "GET",
  });
};

// 🔹 Operation Count
export const getOperationCount = async (operation) => {
  return await apiFetch(`${MEASUREMENT_API}/count/${operation}`, {
    method: "GET",
  });
};

export { buildPayload };