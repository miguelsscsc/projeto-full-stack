const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Erro ao processar a requisição.");
  }

  return data;
};

export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem("school:token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  return parseResponse(response);
};

export const api = {
  get: (path) => apiRequest(path),
  post: (path, body) =>
    apiRequest(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    apiRequest(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) =>
    apiRequest(path, { method: "DELETE" }).catch((error) => {
      if (error.message === "Unexpected end of JSON input") {
        return null;
      }

      throw error;
    }),
};
