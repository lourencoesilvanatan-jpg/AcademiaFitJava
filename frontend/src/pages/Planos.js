import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import FormModal from '../components/FormModal';
import Toast from '../components/Toast';
import Loading from '../components/Loading';

const EMPTY = { nome: '', valor: '', duracaoDias: '', descricao: '' };
const PAGE_SIZE = 10;

export default function Planos() {
  const [planos, setPlanos] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const carregar = useCallback(() => {
    setLoading(true);
    api.get('/planos', { params: { page, size: PAGE_SIZE } })
      .then((r) => {
        setPlanos(r.data.content || []);
        setTotalPages(r.data.totalPages || 0);
      })
      .catch(() => setToast({ msg: 'Erro ao carregar planos', type: 'error' }))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { carregar(); }, [carregar]);

  const abrirNovo = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const abrirEdicao = (p) => {
    setForm({ nome: p.nome, valor: p.valor, duracaoDias: p.duracaoDias, descricao: p.descricao || '' });
    setEditId(p.idPlano);
    setShowForm(true);
  };
  const fecharModal = () => { setShowForm(false); setForm(EMPTY); setEditId(null); };

  const salvar = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, valor: parseFloat(form.valor), duracaoDias: parseInt(form.duracaoDias) };
      if (editId) {
        await api.put(`/planos/${editId}`, payload);
        setToast({ msg: 'Plano atualizado!', type: 'success' });
      } else {
        await api.post('/planos', payload);
        setToast({ msg: 'Plano cadastrado!', type: 'success' });
      }
      fecharModal();
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao salvar', type: 'error' });
    }
  };

  const excluir = async (id) => {
    try {
      await api.delete(`/planos/${id}`);
      setToast({ msg: 'Plano excluido!', type: 'success' });
      if (planos.length === 1 && page > 0) setPage(page - 1);
      else carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao excluir', type: 'error' });
    }
    setConfirm(null);
  };

  return (
    <>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
      <ConfirmDialog show={!!confirm} title="Confirmar Exclusao"
        message="Tem certeza que deseja excluir este plano?" onCancel={() => setConfirm(null)}
        onConfirm={() => excluir(confirm)} />

      <div className="card">
        <h3>Planos</h3>
        <div className="toolbar">
          <div className="toolbar-spacer" />
          <button className="btn btn-save" onClick={abrirNovo}>+ Novo Plano</button>
        </div>
        {loading ? <Loading /> : (
          <>
            <table className="data-table">
              <thead><tr><th>Nome</th><th>Valor</th><th>Duracao</th><th>Descricao</th><th>Acoes</th></tr></thead>
              <tbody>
                {planos.length === 0 && <tr><td colSpan="5" className="empty">Nenhum plano cadastrado.</td></tr>}
                {planos.map((p) => (
                  <tr key={p.idPlano}>
                    <td>{p.nome}</td>
                    <td>R$ {Number(p.valor).toFixed(2)}</td>
                    <td>{p.duracaoDias} dias</td>
                    <td>{p.descricao}</td>
                    <td className="actions">
                      <button className="link-edit" onClick={() => abrirEdicao(p)}>Editar</button>
                      <button className="link-delete" onClick={() => setConfirm(p.idPlano)}>Excluir</button>
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

      <FormModal show={showForm} title={editId ? 'Editar Plano' : 'Novo Plano'}
                 onClose={fecharModal} size="lg">
        <form className="form-grid" onSubmit={salvar}>
          <label>Nome</label>
          <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required placeholder="Ex: Plano Mensal" autoFocus />
          <label>Valor (R$)</label>
          <input type="number" step="0.01" min="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} required placeholder="99.90" />
          <label>Duracao (dias)</label>
          <input type="number" min="1" value={form.duracaoDias} onChange={(e) => setForm({ ...form, duracaoDias: e.target.value })} required placeholder="30" />
          <label>Descricao</label>
          <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descricao do plano" rows="2" />
          <div className="btn-group modal-actions">
            <button type="button" className="btn btn-cancel" onClick={fecharModal}>Cancelar</button>
            <button type="submit" className="btn btn-save">{editId ? 'Atualizar' : 'Salvar'}</button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
