import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
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
            <label>Usuario</label>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)}
                   placeholder="Digite seu usuario" required />
          </div>
          <div className="login-field">
            <label>Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
                   placeholder="Digite sua senha" required />
          </div>
          <button type="submit" className="btn btn-login" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="login-footer">
          <small>Usuario padrao: admin / admin123</small>
        </div>
      </div>
    </div>
  );
}
