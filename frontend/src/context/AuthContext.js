import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (loginStr, senha) => {
    const res = await api.post('/auth/login', { login: loginStr, senha });
    const { token, nome, login: loginResp } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify({ nome, login: loginResp }));
    setUsuario({ nome, login: loginResp });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  const isLogado = !!usuario;

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isLogado }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
