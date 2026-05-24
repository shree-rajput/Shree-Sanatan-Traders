import React, { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext();

// ✅ Synchronous hydration from localStorage — prevents ProtectedRoute redirect flash
const getInitialUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getInitialToken = () => {
  return localStorage.getItem("token") || null;
};

export const AuthProvider = ({ children }) => {
  // 🔑 Initialize synchronously — no useEffect delay
  const [user, setUser] = useState(getInitialUser);
  const [token, setToken] = useState(getInitialToken);

  const login = useCallback((userData, authToken) => {
    // Remove password from stored data
    const { password, ...safeUser } = userData;
    setUser(safeUser);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(safeUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
  }, []);

  // ✅ Helper: check if user is admin
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
