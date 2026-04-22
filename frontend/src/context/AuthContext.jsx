import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("school:token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("school:token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const data = await api.post("/auth/login", credentials);
    localStorage.setItem("school:token", data.token);
    setUser(data.user);
  };

  const register = (payload) => api.post("/auth/register", payload);

  const logout = () => {
    localStorage.removeItem("school:token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
