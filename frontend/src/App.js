import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import Planos from './pages/Planos';
import Matriculas from './pages/Matriculas';
import Exercicios from './pages/Exercicios';
import Treinos from './pages/Treinos';
import Usuarios from './pages/Usuarios';
import './App.css';

function PrivateRoute({ children }) {
  const { isLogado } = useAuth();
  return isLogado ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isLogado } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isLogado ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/alunos" element={<PrivateRoute><Alunos /></PrivateRoute>} />
      <Route path="/planos" element={<PrivateRoute><Planos /></PrivateRoute>} />
      <Route path="/matriculas" element={<PrivateRoute><Matriculas /></PrivateRoute>} />
      <Route path="/exercicios" element={<PrivateRoute><Exercicios /></PrivateRoute>} />
      <Route path="/treinos" element={<PrivateRoute><Treinos /></PrivateRoute>} />
      <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
