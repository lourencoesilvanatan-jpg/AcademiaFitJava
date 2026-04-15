import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/alunos', label: 'Alunos' },
  { path: '/planos', label: 'Planos' },
  { path: '/matriculas', label: 'Matriculas' },
  { path: '/exercicios', label: 'Exercicios' },
  { path: '/treinos', label: 'Treinos' },
  { path: '/usuarios', label: 'Usuarios' },
];

export default function Layout({ children }) {
  const { usuario, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <h2>AcademiaFit</h2>
          <span>Sistema de Gerenciamento</span>
        </div>
        <div className="header-user">
          <span className="user-name">{usuario?.nome}</span>
          <button className="btn-logout" onClick={logout}>Sair</button>
        </div>
      </header>

      <nav className="nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'nav-active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="content">
        {children}
      </main>

      <footer className="footer">
        AcademiaFit &copy; 2026 - Sistema de Gerenciamento de Academia
      </footer>
    </div>
  );
}
