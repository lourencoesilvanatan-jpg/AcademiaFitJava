import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await doLogin(login, senha);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>AcademiaFit</h1>
          <p>Sistema de Gerenciamento de Academia</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {erro && <div className="msg msg-error">{erro}</div>}
          <div className="login-field">
            <label htmlFor="login-user">Usuario</label>
            <input id="login-user" type="text" value={login} onChange={(e) => setLogin(e.target.value)}
                   placeholder="Digite seu usuario" autoComplete="username" required />
          </div>
          <div className="login-field">
            <label htmlFor="login-pass">Senha</label>
            <div className="login-input-wrapper">
              <input id="login-pass" type={showPassword ? 'text' : 'password'} value={senha}
                     onChange={(e) => setSenha(e.target.value)}
                     placeholder="Digite sua senha" autoComplete="current-password" required />
              <button type="button" className="toggle-password"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      tabIndex={-1}>
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-login-spinner" />
                Entrando...
              </>
            ) : 'Entrar'}
          </button>
        </form>
        <div className="login-footer">
          Usuario padrao: admin / admin123
        </div>
      </div>
    </div>
  );
}
