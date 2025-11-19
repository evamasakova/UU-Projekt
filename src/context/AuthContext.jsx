import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = async (credentials) => {
    const { email } = credentials;
    const fakeUser = { id: 1, name: email.split("@")[0] || "User", email };
    const fakeToken = "fake-jwt-token";

    setToken(fakeToken);
    setUser(fakeUser);
    localStorage.setItem("authToken", fakeToken);
    localStorage.setItem("authUser", JSON.stringify(fakeUser));

    return { user: fakeUser, token: fakeToken };
  };

  const register = async (data) => {
    const { name } = data;

    const result = await login(data);
    const updatedUser = { ...(result.user ?? {}), name: name || result.user.name };

    setUser(updatedUser);
    localStorage.setItem("authUser", JSON.stringify(updatedUser));

    return { ...result, user: updatedUser };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const value = { token, user, isAuthenticated: !!token, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
