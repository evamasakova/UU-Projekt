import { useAuth } from "../context/AuthContext.jsx";

/**
 * USAGE: 
 * import { useApi } from "../api/apiClient";
 * const api = useApi();
 * GET example:
 * const campaigns = await api("/projects");
 * POST example:
 * await api("/projects", {
  method: "POST",
  body: {
    name: "Pomoc útulkům",
    goalAmount: 10000,
    category: "Zvířata",
  },
});
 */
export function useApi() {
  const { token } = useAuth();

  return async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`API ${response.status}: ${message}`);
    }

    return response.json();
  };
}

