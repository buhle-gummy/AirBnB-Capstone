import { API_URL } from "../config/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed (${response.status})`
    );
  }

  return data;
}

export const api = {
  getAccommodations: () =>
    request("/accommodations"),

  getAccommodation: (id) =>
    request(`/accommodations/${id}`),

  login: (body) =>
    request("/users/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  register: (body) =>
    request("/users/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  createReservation: (body) =>
    request("/reservations", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getReservations: () =>
    request("/reservations"),
};