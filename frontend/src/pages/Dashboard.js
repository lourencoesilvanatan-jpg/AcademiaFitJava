import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Alunos', value: stats.totalAlunos, path: '/alunos', color: '#1e293b' },
    { label: 'Planos', value: stats.totalPlanos, path: '/planos', color: '#1e293b' },
    { label: 'Matriculas Ativas', value: stats.matriculasAtivas, path: '/matriculas', color: '#3b82f6' },
    { label: 'Exercicios', value: stats.totalExercicios, path: '/exercicios', color: '#1e293b' },
    { label: 'Treinos', value: stats.totalTreinos, path: '/treinos', color: '#1e293b' },
  ];

  return (
    <div className="welcome-card">
      <h1>Bem-vindo ao AcademiaFit</h1>
      <p>Sistema completo de gerenciamento para sua academia.</p>
      {loading ? <Loading /> : (
        <div className="stats-grid">
          {cards.map((c) => (
            <Link key={c.label} to={c.path} className="stat-item" style={{ background: c.color }}>
              <div className="stat-number">{c.value ?? '-'}</div>
              <div className="stat-label">{c.label}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
