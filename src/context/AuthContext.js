import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [logueado, setLogueado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLogueado(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setLogueado(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLogueado(false);
  };

  return (
    <AuthContext.Provider value={{ logueado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);