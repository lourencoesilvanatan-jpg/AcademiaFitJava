import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import FormModal from '../components/FormModal';
import Toast from '../components/Toast';
import Loading from '../components/Loading';
import useDebounce from '../utils/useDebounce';

const GRUPOS = ['PEITORAL','COSTAS','OMBROS','BICEPS','TRICEPS','QUADRICEPS','POSTERIOR','GLUTEOS','PANTURRILHA','ABDOMEN','ANTEBRACO','TRAPEZIO','CORPO_INTEIRO','CARDIO'];
const GRUPO_LABEL = {PEITORAL:'Peitoral',COSTAS:'Costas',OMBROS:'Ombros',BICEPS:'Biceps',TRICEPS:'Triceps',QUADRICEPS:'Quadriceps',POSTERIOR:'Posterior',GLUTEOS:'Gluteos',PANTURRILHA:'Panturrilha',ABDOMEN:'Abdomen',ANTEBRACO:'Antebraco',TRAPEZIO:'Trapezio',CORPO_INTEIRO:'Corpo Inteiro',CARDIO:'Cardio'};

const EMPTY = { nome: '', grupoMuscular: '', descricao: '' };
const PAGE_SIZE = 10;

export default function Exercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filtro, setFiltro] = useState('');
  const debouncedFiltro = useDebounce(filtro, 350);
  const [confirm, setConfirm] = useState(null);
  const [confirmEdit, setConfirmEdit] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const carregar = useCallback(() => {
    setLoading(true);
    const params = { page, size: PAGE_SIZE };
    if (debouncedFiltro) params.nome = debouncedFiltro;
    api.get('/exercicios', { params })
      .then((r) => {
        setExercicios(r.data.content || []);
        setTotalPages(r.data.totalPages || 0);
      })
      .catch(() => setToast({ msg: 'Erro ao carregar exercicios', type: 'error' }))
      .finally(() => setLoading(false));
  }, [page, debouncedFiltro]);

  useEffect(() => { carregar(); }, [carregar]);

  const onFiltroChange = (e) => { setFiltro(e.target.value); setPage(0); };

  const abrirNovo = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const abrirEdicao = (ex) => {
    setForm({ nome: ex.nome, grupoMuscular: ex.grupoMuscular || '', descricao: ex.descricao || '' });
    setEditId(ex.idExercicio);
    setShowForm(true);
  };
  const fecharModal = () => { setShowForm(false); setForm(EMPTY); setEditId(null); };

  const salvar = async (e) => {
    e.preventDefault();
    const payload = { ...form, grupoMuscular: form.grupoMuscular || null };
    if (editId) { setConfirmEdit({ id: editId, payload }); return; }
    try {
      await api.post('/exercicios', payload);
      setToast({ msg: 'Exercicio cadastrado!', type: 'success' });
      fecharModal();
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao salvar', type: 'error' });
    }
  };

  const confirmarEdicao = async () => {
    if (!confirmEdit) return;
    try {
      await api.put(`/exercicios/${confirmEdit.id}`, confirmEdit.payload);
      setToast({ msg: 'Exercicio atualizado!', type: 'success' });
      setConfirmEdit(null);
      fecharModal();
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao salvar', type: 'error' });
      setConfirmEdit(null);
    }
  };

  const excluir = async (id) => {
    try {
      await api.delete(`/exercicios/${id}`);
      setToast({ msg: 'Exercicio excluido!', type: 'success' });
      if (exercicios.length === 1 && page > 0) setPage(page - 1);
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
        message="Tem certeza que deseja excluir este exercicio?" onCancel={() => setConfirm(null)}
        onConfirm={() => excluir(confirm)} />
      <ConfirmDialog show={!!confirmEdit} title="Confirmar Edicao"
        message="Deseja realmente salvar as alteracoes deste exercicio?"
        confirmLabel="Sim, Salvar" variant="primary"
        onCancel={() => setConfirmEdit(null)} onConfirm={confirmarEdicao} />

      <div className="card">
        <h3>Exercicios</h3>
        <div className="toolbar">
          <input type="text" placeholder="Buscar por nome..." value={filtro} onChange={onFiltroChange} />
          <div className="toolbar-spacer" />
          <button className="btn btn-save" onClick={abrirNovo}>+ Novo Exercicio</button>
        </div>
        {loading ? <Loading /> : (
          <>
            <table className="data-table">
              <thead><tr><th>Nome</th><th>Grupo Muscular</th><th>Descricao</th><th>Acoes</th></tr></thead>
              <tbody>
                {exercicios.length === 0 && <tr><td colSpan="4" className="empty">Nenhum exercicio cadastrado.</td></tr>}
                {exercicios.map((ex) => (
                  <tr key={ex.idExercicio}>
                    <td>{ex.nome}</td>
                    <td><span className="badge-grupo">{GRUPO_LABEL[ex.grupoMuscular] || ex.grupoMuscular}</span></td>
                    <td>{ex.descricao}</td>
                    <td className="actions">
                      <button className="link-edit" onClick={() => abrirEdicao(ex)}>Editar</button>
                      <button className="link-delete" onClick={() => setConfirm(ex.idExercicio)}>Excluir</button>
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

      <FormModal show={showForm} title={editId ? 'Editar Exercicio' : 'Novo Exercicio'}
                 onClose={fecharModal} size="lg">
        <form className="form-grid" onSubmit={salvar}>
          <label>Nome</label>
          <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required placeholder="Ex: Supino Reto" autoFocus />
          <label>Grupo Muscular</label>
          <select value={form.grupoMuscular} onChange={(e) => setForm({ ...form, grupoMuscular: e.target.value })}>
            <option value="">-- Selecione --</option>
            {GRUPOS.map((g) => <option key={g} value={g}>{GRUPO_LABEL[g]}</option>)}
          </select>
          <label>Descricao</label>
          <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows="3" placeholder="Descricao do exercicio..." />
          <div className="btn-group modal-actions">
            <button type="button" className="btn btn-cancel" onClick={fecharModal}>Cancelar</button>
            <button type="submit" className="btn btn-save">{editId ? 'Atualizar' : 'Salvar'}</button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
