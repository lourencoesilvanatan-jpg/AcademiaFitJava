import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import FormModal from '../components/FormModal';
import Toast from '../components/Toast';
import Loading from '../components/Loading';
import useDebounce from '../utils/useDebounce';

const EMPTY = { nome: '', login: '', senha: '' };
const PAGE_SIZE = 10;

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filtro, setFiltro] = useState('');
  const debouncedFiltro = useDebounce(filtro, 350);
  const [confirmEdit, setConfirmEdit] = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const carregar = useCallback(() => {
    setLoading(true);
    const params = { page, size: PAGE_SIZE };
    if (debouncedFiltro) params.nome = debouncedFiltro;
    api.get('/usuarios', { params })
      .then((r) => {
        setUsuarios(r.data.content || []);
        setTotalPages(r.data.totalPages || 0);
      })
      .catch(() => setToast({ msg: 'Erro ao carregar usuarios', type: 'error' }))
      .finally(() => setLoading(false));
  }, [page, debouncedFiltro]);

  useEffect(() => { carregar(); }, [carregar]);

  const onFiltroChange = (e) => { setFiltro(e.target.value); setPage(0); };

  const abrirNovo = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const abrirEdicao = (u) => {
    setForm({ nome: u.nome, login: u.login, senha: '' });
    setEditId(u.idUsuario);
    setShowForm(true);
  };
  const fecharModal = () => { setShowForm(false); setForm(EMPTY); setEditId(null); };

  const salvar = async (e) => {
    e.preventDefault();
    if (editId) {
      const payload = { nome: form.nome, login: form.login };
      if (form.senha) payload.senha = form.senha;
      setConfirmEdit({ id: editId, payload });
      return;
    }
    if (!form.senha) {
      setToast({ msg: 'Senha e obrigatoria para novo usuario', type: 'error' });
      return;
    }
    try {
      await api.post('/usuarios', form);
      setToast({ msg: 'Usuario cadastrado!', type: 'success' });
      fecharModal();
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao salvar', type: 'error' });
    }
  };

  const confirmarEdicao = async () => {
    if (!confirmEdit) return;
    try {
      await api.put(`/usuarios/${confirmEdit.id}`, confirmEdit.payload);
      setToast({ msg: 'Usuario atualizado!', type: 'success' });
      setConfirmEdit(null);
      fecharModal();
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao salvar', type: 'error' });
      setConfirmEdit(null);
    }
  };

  const confirmarToggle = async () => {
    if (!confirmToggle) return;
    try {
      await api.put(`/usuarios/${confirmToggle.id}/toggle`);
      setToast({ msg: 'Status atualizado!', type: 'success' });
      setConfirmToggle(null);
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao atualizar status', type: 'error' });
      setConfirmToggle(null);
    }
  };

  return (
    <>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
      <ConfirmDialog show={!!confirmEdit} title="Confirmar Edicao"
        message="Deseja realmente salvar as alteracoes deste usuario?"
        confirmLabel="Sim, Salvar" variant="primary"
        onCancel={() => setConfirmEdit(null)} onConfirm={confirmarEdicao} />
      <ConfirmDialog show={!!confirmToggle}
        title={confirmToggle?.ativo ? 'Desativar Usuario' : 'Ativar Usuario'}
        message={confirmToggle?.ativo
          ? `Deseja realmente desativar o usuario "${confirmToggle?.nome}"? Ele nao podera mais acessar o sistema.`
          : `Deseja realmente reativar o usuario "${confirmToggle?.nome}"? Ele voltara a ter acesso ao sistema.`}
        confirmLabel={confirmToggle?.ativo ? 'Sim, Desativar' : 'Sim, Ativar'}
        variant={confirmToggle?.ativo ? 'danger' : 'primary'}
        onCancel={() => setConfirmToggle(null)} onConfirm={confirmarToggle} />

      <div className="card">
        <h3>Usuarios</h3>
        <div className="toolbar">
          <input type="text" placeholder="Buscar por nome ou login..." value={filtro} onChange={onFiltroChange} />
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
                      <button className="link-delete" onClick={() => setConfirmToggle({ id: u.idUsuario, nome: u.nome, ativo: u.ativo })}>
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
