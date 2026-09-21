import { API_URL } from "../config/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  try {
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
          `Server returned ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error("API ERROR:", error);

    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to the backend. Make sure the server is running on port 5000."
      );
    }

    throw error;
  }
}

/* =========================
   CUSTOMER API
========================= */

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

/* =========================
   ADMIN API
========================= */

export const adminApi = {
  getAccommodations: () =>
    request("/accommodations"),

  getAccommodation: (id) =>
    request(`/accommodations/${id}`),

  getReservations: () =>
    request("/reservations"),

  getUsers: () =>
    request("/users"),

  createAccommodation: (body) =>
    request("/accommodations", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateAccommodation: (id, body) =>
    request(`/accommodations/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteAccommodation: (id) =>
    request(`/accommodations/${id}`, {
      method: "DELETE",
    }),
};