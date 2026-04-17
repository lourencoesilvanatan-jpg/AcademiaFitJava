import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';

const Icon = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const cards = [
  {
    label: 'Alunos', key: 'totalAlunos', path: '/alunos',
    accent: '#3b82f6', accentSoft: 'rgba(59,130,246,0.15)',
    icon: <Icon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>,
  },
  {
    label: 'Planos', key: 'totalPlanos', path: '/planos',
    accent: '#8b5cf6', accentSoft: 'rgba(139,92,246,0.15)',
    icon: <Icon><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></Icon>,
  },
  {
    label: 'Matriculas Ativas', key: 'matriculasAtivas', path: '/matriculas',
    accent: '#10b981', accentSoft: 'rgba(16,185,129,0.15)',
    icon: <Icon><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Icon>,
  },
  {
    label: 'Exercicios', key: 'totalExercicios', path: '/exercicios',
    accent: '#f59e0b', accentSoft: 'rgba(245,158,11,0.15)',
    icon: <Icon><path d="M6.5 6.5h11M6.5 17.5h11M3 9v6M21 9v6M7 9v6M17 9v6"/></Icon>,
  },
  {
    label: 'Treinos', key: 'totalTreinos', path: '/treinos',
    accent: '#ef4444', accentSoft: 'rgba(239,68,68,0.15)',
    icon: <Icon><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>,
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="welcome-card">
      <h1>Bem-vindo ao AcademiaFit</h1>
      <p>Sistema completo de gerenciamento para sua academia.</p>
      {loading ? <Loading /> : (
        <div className="stats-grid">
          {cards.map((c) => (
            <Link
              key={c.label}
              to={c.path}
              className="stat-item"
              style={{ '--accent': c.accent, '--accent-soft': c.accentSoft }}
            >
              <div className="stat-icon">{c.icon}</div>
              <div className="stat-number">{stats[c.key] ?? '-'}</div>
              <div className="stat-label">{c.label}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
