const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

export async function getApi(path) {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`API request failed (${response.status}): ${details}`);
  }

  return response.json();
}
