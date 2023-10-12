/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
// GET /reservations?date=
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations?date=${params}`);
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}
// POST /reservations
export async function createReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  const method = "POST";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({ data: reservation });
  return await fetchJson(url, { method, headers, body, signal }, []);
}
// POST /tables
export async function createTable(newTable, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  const method = "POST";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({ data: newTable });
  return await fetchJson(url, { method, headers, body, signal }, []);
}
// GET /tables
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}
// GET /reservations/:reservation_id
export async function getReservation(param, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${param}`);
  return await fetchJson(url, { headers, signal }, []);
}
// PUT tables/:table_id/seat
export async function updateTable(tableId, reservationId, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
  const method = "PUT";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({ data: { reservation_id: reservationId } });
  return await fetchJson(url, { method, headers, body, signal }, []);
}
// DELETE tables/:table_id/seat
export async function removeTableAssignment(tableId, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
  const method = "DELETE";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  return await fetchJson(url, { method, headers, signal }, []);
}

// PUT reservations/:reservation_id/status
export async function updateReservationStatus(resID, status, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${resID}/status`);
  const method = "PUT";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({ data: { status: status } });
  return await fetchJson(url, { method, headers, body, signal }, []);
}
// GET reservations/?mobile_number
export async function searchReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations?mobile_number=${params}`);
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

// PUT reservations/:reservation_id
export async function editReservation(resID, updatedRes, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${resID}`);
  const method = "PUT";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({ data: updatedRes });
  return await fetchJson(url, { method, headers, body, signal }, []);
}
