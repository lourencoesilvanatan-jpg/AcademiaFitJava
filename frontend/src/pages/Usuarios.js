import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import Loading from '../components/Loading';

const EMPTY = { nome: '', login: '', senha: '' };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(() => {
    setLoading(true);
    api.get('/usuarios')
      .then((r) => setUsuarios(r.data))
      .catch(() => setToast({ msg: 'Erro ao carregar usuarios', type: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const salvar = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const payload = { nome: form.nome, login: form.login };
        if (form.senha) payload.senha = form.senha;
        await api.put(`/usuarios/${editId}`, payload);
        setToast({ msg: 'Usuario atualizado!', type: 'success' });
      } else {
        if (!form.senha) {
          setToast({ msg: 'Senha e obrigatoria para novo usuario', type: 'error' });
          return;
        }
        await api.post('/usuarios', form);
        setToast({ msg: 'Usuario cadastrado!', type: 'success' });
      }
      setForm(EMPTY); setEditId(null); carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao salvar', type: 'error' });
    }
  };

  const editar = (u) => {
    setForm({ nome: u.nome, login: u.login, senha: '' });
    setEditId(u.idUsuario);
  };

  const toggleAtivo = async (id) => {
    try {
      await api.put(`/usuarios/${id}/toggle`);
      setToast({ msg: 'Status atualizado!', type: 'success' });
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao atualizar status', type: 'error' });
    }
  };

  return (
    <>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

      <div className="card">
        <h3>Usuarios</h3>
        {loading ? <Loading /> : (
          <table className="data-table">
            <thead><tr><th>Nome</th><th>Login</th><th>Status</th><th>Acoes</th></tr></thead>
            <tbody>
              {usuarios.length === 0 && <tr><td colSpan="4" className="empty">Nenhum usuario cadastrado.</td></tr>}
              {usuarios.map((u) => (
                <tr key={u.idUsuario}>
                  <td>{u.nome}</td>
                  <td>{u.login}</td>
                  <td>
                    <span className={`status-badge ${u.ativo ? 'status-ATIVA' : 'status-CANCELADA'}`}>
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="link-edit" onClick={() => editar(u)}>Editar</button>
                    <button className="link-delete" onClick={() => toggleAtivo(u.idUsuario)}>
                      {u.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3>{editId ? 'Editar Usuario' : 'Cadastro de Usuario'}</h3>
        <form className="form-grid" onSubmit={salvar}>
          <label>Nome:</label>
          <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required placeholder="Nome completo" />
          <label>Login:</label>
          <input type="text" value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} required placeholder="Login de acesso" />
          <label>{editId ? 'Nova Senha:' : 'Senha:'}</label>
          <input type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })}
            placeholder={editId ? 'Deixe vazio para manter' : 'Senha de acesso'} required={!editId} />
          <div></div>
          <div className="btn-group">
            <button type="submit" className="btn btn-save">{editId ? 'Atualizar' : 'Salvar'}</button>
            <button type="button" className="btn btn-cancel" onClick={() => { setForm(EMPTY); setEditId(null); }}>Limpar</button>
          </div>
        </form>
      </div>
    </>
  );
}
