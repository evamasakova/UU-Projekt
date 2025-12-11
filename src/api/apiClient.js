import { useAuth } from "../context/AuthContext.jsx";
/**
 * API CALLSs
 * @returns
 */
export function useApi() {
  const { token } = useAuth();

  return async (url, options = {}) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "API request failed";
        try {
          const errJson = await response.json();
          if (errJson?.message) errorMessage = errJson.message;
        } catch {}

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  };
}
