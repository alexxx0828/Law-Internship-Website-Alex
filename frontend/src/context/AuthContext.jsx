import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, getMeApi, setToken, clearToken, getToken } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // null = checking, false = not authed, object = authed
  const [user, setUser] = useState(null);

  useEffect(() => {
    const check = async () => {
      if (!getToken()) {
        setUser(false);
        return;
      }
      try {
        const me = await getMeApi();
        setUser(me);
      } catch (e) {
        clearToken();
        setUser(false);
      }
    };
    check();
  }, []);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearToken();
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
