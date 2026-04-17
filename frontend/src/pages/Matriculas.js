import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import FormModal from '../components/FormModal';
import Toast from '../components/Toast';
import Loading from '../components/Loading';

const STATUS_OPTIONS = ['ATIVA', 'CANCELADA', 'EXPIRADA'];
const STATUS_LABEL = { ATIVA: 'Ativa', CANCELADA: 'Cancelada', EXPIRADA: 'Expirada' };
const EMPTY = { aluno: '', plano: '', dataInicio: '', dataFim: '', status: 'ATIVA' };
const PAGE_SIZE = 10;
const ALL = 10000;

export default function Matriculas() {
  const [matriculas, setMatriculas] = useState([]);
  const [alunos, setAlunos] = useState([]);
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
    api.get('/matriculas', { params: { page, size: PAGE_SIZE } })
      .then((r) => {
        setMatriculas(r.data.content || []);
        setTotalPages(r.data.totalPages || 0);
      })
      .catch(() => setToast({ msg: 'Erro ao carregar matriculas', type: 'error' }))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { carregar(); }, [carregar]);

  useEffect(() => {
    api.get('/alunos', { params: { page: 0, size: ALL } })
      .then((r) => setAlunos(r.data.content || [])).catch(() => {});
    api.get('/planos', { params: { page: 0, size: ALL } })
      .then((r) => setPlanos(r.data.content || [])).catch(() => {});
  }, []);

  const abrirNovo = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const abrirEdicao = (m) => {
    setForm({
      aluno: m.aluno?.idAluno || '', plano: m.plano?.idPlano || '',
      dataInicio: m.dataInicio || '', dataFim: m.dataFim || '', status: m.status || 'ATIVA',
    });
    setEditId(m.idMatricula);
    setShowForm(true);
  };
  const fecharModal = () => { setShowForm(false); setForm(EMPTY); setEditId(null); };

  const salvar = async (e) => {
    e.preventDefault();
    try {
      const alunoObj = alunos.find((a) => String(a.idAluno) === String(form.aluno));
      const planoObj = planos.find((p) => String(p.idPlano) === String(form.plano));
      const payload = {
        aluno: alunoObj, plano: planoObj,
        dataInicio: form.dataInicio, dataFim: form.dataFim || null,
        status: form.status,
      };
      if (editId) {
        await api.put(`/matriculas/${editId}`, payload);
        setToast({ msg: 'Matricula atualizada!', type: 'success' });
      } else {
        await api.post('/matriculas', payload);
        setToast({ msg: 'Matricula cadastrada!', type: 'success' });
      }
      fecharModal();
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao salvar', type: 'error' });
    }
  };

  const excluir = async (id) => {
    try {
      await api.delete(`/matriculas/${id}`);
      setToast({ msg: 'Matricula excluida!', type: 'success' });
      if (matriculas.length === 1 && page > 0) setPage(page - 1);
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
        message="Tem certeza que deseja excluir esta matricula?" onCancel={() => setConfirm(null)}
        onConfirm={() => excluir(confirm)} />

      <div className="card">
        <h3>Matriculas</h3>
        <div className="toolbar">
          <div className="toolbar-spacer" />
          <button className="btn btn-save" onClick={abrirNovo}>+ Nova Matricula</button>
        </div>
        {loading ? <Loading /> : (
          <>
            <table className="data-table">
              <thead><tr><th>Aluno</th><th>Plano</th><th>Inicio</th><th>Fim</th><th>Status</th><th>Acoes</th></tr></thead>
              <tbody>
                {matriculas.length === 0 && <tr><td colSpan="6" className="empty">Nenhuma matricula encontrada.</td></tr>}
                {matriculas.map((m) => (
                  <tr key={m.idMatricula}>
                    <td>{m.aluno?.nome}</td>
                    <td>{m.plano?.nome}</td>
                    <td>{m.dataInicio}</td>
                    <td>{m.dataFim}</td>
                    <td><span className={`status-badge status-${m.status}`}>{STATUS_LABEL[m.status] || m.status}</span></td>
                    <td className="actions">
                      <button className="link-edit" onClick={() => abrirEdicao(m)}>Editar</button>
                      <button className="link-delete" onClick={() => setConfirm(m.idMatricula)}>Excluir</button>
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

      <FormModal show={showForm} title={editId ? 'Editar Matricula' : 'Nova Matricula'}
                 onClose={fecharModal} size="lg">
        <form className="form-grid" onSubmit={salvar}>
          <label>Aluno</label>
          <select value={form.aluno} onChange={(e) => setForm({ ...form, aluno: e.target.value })} required autoFocus>
            <option value="">-- Selecione --</option>
            {alunos.map((a) => <option key={a.idAluno} value={a.idAluno}>{a.nome}</option>)}
          </select>
          <label>Plano</label>
          <select value={form.plano} onChange={(e) => setForm({ ...form, plano: e.target.value })} required>
            <option value="">-- Selecione --</option>
            {planos.map((p) => <option key={p.idPlano} value={p.idPlano}>{p.nome}</option>)}
          </select>
          <label>Data Inicio</label>
          <input type="date" value={form.dataInicio} onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} required />
          <label>Data Fim</label>
          <input type="date" value={form.dataFim} onChange={(e) => setForm({ ...form, dataFim: e.target.value })} placeholder="Calculada automaticamente" />
          <label>Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
          <div className="btn-group modal-actions">
            <button type="button" className="btn btn-cancel" onClick={fecharModal}>Cancelar</button>
            <button type="submit" className="btn btn-save">{editId ? 'Atualizar' : 'Salvar'}</button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
