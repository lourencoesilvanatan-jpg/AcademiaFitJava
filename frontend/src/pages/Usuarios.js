import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import FormModal from '../components/FormModal';
import Toast from '../components/Toast';
import Loading from '../components/Loading';

const EMPTY = { nome: '', login: '', senha: '' };
const PAGE_SIZE = 10;

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const carregar = useCallback(() => {
    setLoading(true);
    api.get('/usuarios', { params: { page, size: PAGE_SIZE } })
      .then((r) => {
        setUsuarios(r.data.content || []);
        setTotalPages(r.data.totalPages || 0);
      })
      .catch(() => setToast({ msg: 'Erro ao carregar usuarios', type: 'error' }))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { carregar(); }, [carregar]);

  const abrirNovo = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const abrirEdicao = (u) => {
    setForm({ nome: u.nome, login: u.login, senha: '' });
    setEditId(u.idUsuario);
    setShowForm(true);
  };
  const fecharModal = () => { setShowForm(false); setForm(EMPTY); setEditId(null); };

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
      fecharModal();
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao salvar', type: 'error' });
    }
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
        <div className="toolbar">
          <div className="toolbar-spacer" />
          <button className="btn btn-save" onClick={abrirNovo}>+ Novo Usuario</button>
        </div>
        {loading ? <Loading /> : (
          <>
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
                      <button className="link-edit" onClick={() => abrirEdicao(u)}>Editar</button>
                      <button className="link-delete" onClick={() => toggleAtivo(u.idUsuario)}>
                        {u.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="pagination">
                <button className="btn-page" disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
                <span className="page-info">Pagina {page + 1} de {totalPages}</span>
                <button className="btn-page" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Proxima</button>
              </div>
            )}
          </>
        )}
      </div>

      <FormModal show={showForm} title={editId ? 'Editar Usuario' : 'Novo Usuario'}
                 onClose={fecharModal} size="lg">
        <form className="form-grid" onSubmit={salvar}>
          <label>Nome</label>
          <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required placeholder="Nome completo" autoFocus />
          <label>Login</label>
          <input type="text" value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} required placeholder="Login de acesso" />
          <label>{editId ? 'Nova Senha' : 'Senha'}</label>
          <input type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })}
            placeholder={editId ? 'Deixe vazio para manter' : 'Senha de acesso'} required={!editId} />
          <div className="btn-group modal-actions">
            <button type="button" className="btn btn-cancel" onClick={fecharModal}>Cancelar</button>
            <button type="submit" className="btn btn-save">{editId ? 'Atualizar' : 'Salvar'}</button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
