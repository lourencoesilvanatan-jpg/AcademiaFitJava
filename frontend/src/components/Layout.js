import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/alunos', label: 'Alunos' },
  { path: '/planos', label: 'Planos' },
  { path: '/matriculas', label: 'Matriculas' },
  { path: '/exercicios', label: 'Exercicios' },
  { path: '/treinos', label: 'Treinos' },
  { path: '/usuarios', label: 'Usuarios' },
];

function getIniciais(nome) {
  if (!nome) return '?';
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] || '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const DumbbellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5v11" />
    <path d="M17.5 6.5v11" />
    <path d="M3 9.5v5" />
    <path d="M21 9.5v5" />
    <path d="M6.5 12h11" />
  </svg>
);

export default function Layout({ children }) {
  const { usuario, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="header-brand-icon" aria-hidden="true"><DumbbellIcon /></span>
          <div className="header-brand-text">
            <h2>Academia<span className="brand-accent">Fit</span></h2>
            <span>Sistema de Gestao</span>
          </div>
        </div>
        <div className="header-user">
          <button className="btn-theme" onClick={toggle} title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'} aria-label="Alternar tema">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <span className="user-avatar" aria-hidden="true">{getIniciais(usuario?.nome)}</span>
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
        <span className="footer-accent">AcademiaFit</span> &copy; 2026 &middot; Bora treinar
      </footer>
    </div>
  );
}
