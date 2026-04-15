import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import Loading from '../components/Loading';
import { maskCPF, maskPhone, validateCPF } from '../utils/masks';

const EMPTY = { nome: '', cpf: '', email: '', telefone: '', dataNascimento: '' };
const PER_PAGE = 10;

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [errors, setErrors] = useState({});

  const carregar = useCallback(() => {
    setLoading(true);
    const params = filtro ? { nome: filtro } : {};
    api.get('/alunos', { params })
      .then((r) => setAlunos(r.data))
      .catch(() => setToast({ msg: 'Erro ao carregar alunos', type: 'error' }))
      .finally(() => setLoading(false));
  }, [filtro]);

  useEffect(() => { carregar(); }, [carregar]);

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
    try {
      if (editId) {
        await api.put(`/alunos/${editId}`, form);
        setToast({ msg: 'Aluno atualizado!', type: 'success' });
      } else {
        await api.post('/alunos', form);
        setToast({ msg: 'Aluno cadastrado!', type: 'success' });
      }
      setForm(EMPTY);
      setEditId(null);
      setErrors({});
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao salvar', type: 'error' });
    }
  };

  const editar = (a) => {
    setForm({ nome: a.nome, cpf: a.cpf, email: a.email || '', telefone: a.telefone || '', dataNascimento: a.dataNascimento || '' });
    setEditId(a.idAluno);
    setErrors({});
  };

  const excluir = async (id) => {
    try {
      await api.delete(`/alunos/${id}`);
      setToast({ msg: 'Aluno excluido!', type: 'success' });
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao excluir', type: 'error' });
    }
    setConfirm(null);
  };

  const totalPages = Math.ceil(alunos.length / PER_PAGE);
  const paginados = alunos.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
      <ConfirmDialog show={!!confirm} title="Confirmar Exclusao"
        message="Tem certeza que deseja excluir este aluno?" onCancel={() => setConfirm(null)}
        onConfirm={() => excluir(confirm)} />

      <div className="card">
        <h3>Alunos</h3>
        <div className="toolbar">
          <input type="text" placeholder="Buscar por nome..." value={filtro}
                 onChange={(e) => setFiltro(e.target.value)} />
          <button className="btn btn-search" onClick={carregar}>Pesquisar</button>
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
                {paginados.length === 0 && <tr><td colSpan="6" className="empty">Nenhum aluno encontrado.</td></tr>}
                {paginados.map((a) => (
                  <tr key={a.idAluno}>
                    <td>{a.nome}</td>
                    <td>{a.cpf}</td>
                    <td>{a.email}</td>
                    <td>{a.telefone}</td>
                    <td>{a.dataNascimento}</td>
                    <td className="actions">
                      <button className="link-edit" onClick={() => editar(a)}>Editar</button>
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

      <div className="card">
        <h3>{editId ? 'Editar Aluno' : 'Cadastro de Aluno'}</h3>
        <form className="form-grid" onSubmit={salvar}>
          <label>Nome:</label>
          <div>
            <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome completo" />
            {errors.nome && <span className="field-error">{errors.nome}</span>}
          </div>
          <label>CPF:</label>
          <div>
            <input type="text" value={form.cpf} maxLength={14}
              onChange={(e) => setForm({ ...form, cpf: maskCPF(e.target.value) })} placeholder="999.999.999-99" />
            {errors.cpf && <span className="field-error">{errors.cpf}</span>}
          </div>
          <label>E-mail:</label>
          <div>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <label>Telefone:</label>
          <input type="text" value={form.telefone} maxLength={15}
            onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })} placeholder="(99) 99999-9999" />
          <label>Nascimento:</label>
          <input type="date" value={form.dataNascimento} onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} />
          <div></div>
          <div className="btn-group">
            <button type="submit" className="btn btn-save">{editId ? 'Atualizar' : 'Salvar'}</button>
            <button type="button" className="btn btn-cancel" onClick={() => { setForm(EMPTY); setEditId(null); setErrors({}); }}>Limpar</button>
          </div>
        </form>
      </div>
    </>
  );
}
