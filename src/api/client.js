const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
const AUTH_TOKEN_KEY = "adminAccessToken";

export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export function getAuthToken() {
  return window.sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  window.sessionStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiRequest(path, { method = "GET", body, authenticated = false } = {}) {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_URL is not configured.");
  }

  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (authenticated) {
    const token = getAuthToken();
    if (!token) throw new ApiError("Please sign in again to continue.", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = responseText;
    try {
      const parsed = JSON.parse(responseText);
      message = parsed.detail || parsed.message || responseText;
    } catch {
      // Keep the response text when the server does not return JSON.
    }
    if (authenticated && response.status === 401) {
      clearAuthToken();
      window.dispatchEvent(new Event("admin-session-expired"));
    }
    throw new ApiError(`API request failed (${response.status}): ${message}`, response.status);
  }

  if (response.status === 204) return null;
  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) : null;
}

export function getApi(path, options = {}) {
  return apiRequest(path, { ...options, method: "GET" });
}
