import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';

const Icon = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const STATUS_LABEL = { ATIVA: 'Ativa', CANCELADA: 'Cancelada', EXPIRADA: 'Expirada' };

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

function formatarData(iso) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function diasAte(iso) {
  if (!iso) return null;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(iso + 'T00:00:00');
  return Math.round((alvo - hoje) / (1000 * 60 * 60 * 24));
}

function urgenciaClasse(dias) {
  if (dias <= 3) return 'urgencia-alta';
  if (dias <= 7) return 'urgencia-media';
  return 'urgencia-baixa';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [ultimasMatriculas, setUltimasMatriculas] = useState([]);
  const [vencimentos, setVencimentos] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingExtras, setLoadingExtras] = useState(true);

  const abrirMatricula = (m) => {
    navigate('/matriculas', { state: { abrir: m } });
  };

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoadingStats(false));

    Promise.all([
      api.get('/dashboard/ultimas-matriculas', { params: { limite: 5 } }).then((r) => r.data).catch(() => []),
      api.get('/dashboard/proximos-vencimentos', { params: { dias: 30 } }).then((r) => r.data).catch(() => []),
    ]).then(([mats, vencs]) => {
      setUltimasMatriculas(mats);
      setVencimentos(vencs);
      setLoadingExtras(false);
    });
  }, []);

  return (
    <>
      <div className="welcome-card">
        <h1>Bem-vindo ao AcademiaFit</h1>
        <p>Sistema completo de gerenciamento para sua academia.</p>
        {loadingStats ? <Loading /> : (
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

      <div className="dashboard-panels">
        <div className="card panel-card">
          <div className="panel-header">
            <h3>Ultimas Matriculas</h3>
            <Link to="/matriculas" className="panel-link">Ver todas</Link>
          </div>
          {loadingExtras ? <Loading /> : (
            ultimasMatriculas.length === 0 ? (
              <div className="panel-empty">Nenhuma matricula cadastrada.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>Aluno</th><th>Plano</th><th>Inicio</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {ultimasMatriculas.map((m) => (
                    <tr key={m.idMatricula} className="row-clickable" onClick={() => abrirMatricula(m)}>
                      <td>{m.aluno?.nome}</td>
                      <td>{m.plano?.nome}</td>
                      <td>{formatarData(m.dataInicio)}</td>
                      <td><span className={`status-badge status-${m.status}`}>{STATUS_LABEL[m.status] || m.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>

        <div className="card panel-card">
          <div className="panel-header">
            <h3>Vencimentos em 30 dias</h3>
            <span className="panel-badge">{vencimentos.length}</span>
          </div>
          {loadingExtras ? <Loading /> : (
            vencimentos.length === 0 ? (
              <div className="panel-empty">Nenhum vencimento nos proximos 30 dias.</div>
            ) : (
              <ul className="vencimentos-list">
                {vencimentos.map((m) => {
                  const dias = diasAte(m.dataFim);
                  return (
                    <li key={m.idMatricula} className="row-clickable" onClick={() => abrirMatricula(m)}>
                      <span className={`vencimento-dias ${urgenciaClasse(dias)}`}>
                        <strong>{dias}</strong><small>{dias === 1 ? 'dia' : 'dias'}</small>
                      </span>
                      <div className="vencimento-info">
                        <span className="vencimento-aluno">{m.aluno?.nome}</span>
                        <span className="vencimento-meta">{m.plano?.nome} &middot; vence {formatarData(m.dataFim)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )
          )}
        </div>
      </div>
    </>
  );
}
