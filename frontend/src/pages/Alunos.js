import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import FormModal from '../components/FormModal';
import Toast from '../components/Toast';
import Loading from '../components/Loading';
import { maskCPF, maskPhone, validateCPF } from '../utils/masks';
import useDebounce from '../utils/useDebounce';

function formatarData(iso) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

const EMPTY = { nome: '', cpf: '', email: '', telefone: '', dataNascimento: '' };
const PAGE_SIZE = 10;

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
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
  const [errors, setErrors] = useState({});

  const carregar = useCallback(() => {
    setLoading(true);
    const params = { page, size: PAGE_SIZE };
    if (debouncedFiltro) params.nome = debouncedFiltro;
    api.get('/alunos', { params })
      .then((r) => {
        setAlunos(r.data.content || []);
        setTotalPages(r.data.totalPages || 0);
      })
      .catch(() => setToast({ msg: 'Erro ao carregar alunos', type: 'error' }))
      .finally(() => setLoading(false));
  }, [page, debouncedFiltro]);

  useEffect(() => { carregar(); }, [carregar]);

  const onFiltroChange = (e) => { setFiltro(e.target.value); setPage(0); };

  const abrirNovo = () => {
    setForm(EMPTY);
    setEditId(null);
    setErrors({});
    setShowForm(true);
  };

  const abrirEdicao = (a) => {
    setForm({
      nome: a.nome,
      cpf: a.cpf,
      email: a.email || '',
      telefone: a.telefone || '',
      dataNascimento: a.dataNascimento || ''
    });
    setEditId(a.idAluno);
    setErrors({});
    setShowForm(true);
  };

  const fecharModal = () => {
    setShowForm(false);
    setForm(EMPTY);
    setEditId(null);
    setErrors({});
  };

  const validar = () => {
    const errs = {};
    if (!form.nome.trim()) errs.nome = 'Nome e obrigatorio';
    if (!form.cpf.trim()) {
      errs.cpf = 'CPF e obrigatorio';
    } else if (!validateCPF(form.cpf)) {
      errs.cpf = 'CPF invalido';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'E-mail invalido';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    if (editId) { setConfirmEdit({ id: editId, payload: { ...form } }); return; }
    try {
      await api.post('/alunos', form);
      setToast({ msg: 'Aluno cadastrado!', type: 'success' });
      fecharModal();
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao salvar', type: 'error' });
    }
  };

  const confirmarEdicao = async () => {
    if (!confirmEdit) return;
    try {
      await api.put(`/alunos/${confirmEdit.id}`, confirmEdit.payload);
      setToast({ msg: 'Aluno atualizado!', type: 'success' });
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
      await api.delete(`/alunos/${id}`);
      setToast({ msg: 'Aluno excluido!', type: 'success' });
      if (alunos.length === 1 && page > 0) setPage(page - 1);
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
        message="Tem certeza que deseja excluir este aluno?" onCancel={() => setConfirm(null)}
        onConfirm={() => excluir(confirm)} />
      <ConfirmDialog show={!!confirmEdit} title="Confirmar Edicao"
        message="Deseja realmente salvar as alteracoes deste aluno?"
        confirmLabel="Sim, Salvar" variant="primary"
        onCancel={() => setConfirmEdit(null)} onConfirm={confirmarEdicao} />

      <div className="card">
        <h3>Alunos</h3>
        <div className="toolbar">
          <input type="text" placeholder="Buscar por nome..." value={filtro}
                 onChange={onFiltroChange} />
          <div className="toolbar-spacer" />
          <button className="btn btn-save" onClick={abrirNovo}>+ Novo Aluno</button>
        </div>
        {loading ? <Loading /> : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th><th>CPF</th><th>E-mail</th><th>Telefone</th><th>Nascimento</th><th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {alunos.length === 0 && <tr><td colSpan="6" className="empty">Nenhum aluno encontrado.</td></tr>}
                {alunos.map((a) => (
                  <tr key={a.idAluno}>
                    <td>{a.nome}</td>
                    <td>{a.cpf}</td>
                    <td>{a.email}</td>
                    <td>{a.telefone}</td>
                    <td>{formatarData(a.dataNascimento)}</td>
                    <td className="actions">
                      <button className="link-edit" onClick={() => abrirEdicao(a)}>Editar</button>
                      <button className="link-delete" onClick={() => setConfirm(a.idAluno)}>Excluir</button>
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

      <FormModal show={showForm} title={editId ? 'Editar Aluno' : 'Novo Aluno'}
                 onClose={fecharModal} size="lg">
        <form className="form-grid" onSubmit={salvar}>
          <label>Nome</label>
          <input type="text" value={form.nome}
                 onChange={(e) => setForm({ ...form, nome: e.target.value })}
                 placeholder="Nome completo" autoFocus />
          {errors.nome && <span className="field-error">{errors.nome}</span>}
          <label>CPF</label>
          <input type="text" value={form.cpf} maxLength={14}
                 onChange={(e) => setForm({ ...form, cpf: maskCPF(e.target.value) })}
                 placeholder="999.999.999-99" />
          {errors.cpf && <span className="field-error">{errors.cpf}</span>}
          <label>E-mail</label>
          <input type="email" value={form.email}
                 onChange={(e) => setForm({ ...form, email: e.target.value })}
                 placeholder="email@exemplo.com" />
          {errors.email && <span className="field-error">{errors.email}</span>}
          <label>Telefone</label>
          <input type="text" value={form.telefone} maxLength={15}
                 onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })}
                 placeholder="(99) 99999-9999" />
          <label>Nascimento</label>
          <input type="date" value={form.dataNascimento}
                 onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} />
          <div className="btn-group modal-actions">
            <button type="button" className="btn btn-cancel" onClick={fecharModal}>Cancelar</button>
            <button type="submit" className="btn btn-save">{editId ? 'Atualizar' : 'Salvar'}</button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
