import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

const NIVEIS = ['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'];
const NIVEL_LABEL = { INICIANTE: 'Iniciante', INTERMEDIARIO: 'Intermediario', AVANCADO: 'Avancado' };
const EMPTY_TREINO = { nome: '', objetivo: '', nivel: '' };
const EMPTY_TE = { exercicio: '', series: '', repeticoes: '', cargaSugerida: '', descansoSegundos: '', ordem: '' };

export default function Treinos() {
  const [treinos, setTreinos] = useState([]);
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
  const [exerciciosDoTreino, setExerciciosDoTreino] = useState([]);
  const [form, setForm] = useState(EMPTY_TREINO);
  const [teForm, setTeForm] = useState(EMPTY_TE);
  const [editId, setEditId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const carregar = useCallback(() => {
    api.get('/treinos').then((r) => setTreinos(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    carregar();
    api.get('/exercicios').then((r) => setExerciciosDisponiveis(r.data)).catch(() => {});
  }, [carregar]);

  const carregarExercicios = (treinoId) => {
    api.get(`/treinos/${treinoId}/exercicios`).then((r) => setExerciciosDoTreino(r.data)).catch(() => {});
  };

  const salvar = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, nivel: form.nivel || null };
      if (editId) {
        await api.put(`/treinos/${editId}`, payload);
        setToast({ msg: 'Treino atualizado!', type: 'success' });
      } else {
        const res = await api.post('/treinos', payload);
        setEditId(res.data.idTreino);
        setToast({ msg: 'Treino cadastrado! Agora adicione exercicios.', type: 'success' });
      }
      carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao salvar', type: 'error' });
    }
  };

  const editar = (t) => {
    setForm({ nome: t.nome, objetivo: t.objetivo || '', nivel: t.nivel || '' });
    setEditId(t.idTreino);
    carregarExercicios(t.idTreino);
  };

  const excluir = async (id) => {
    try {
      await api.delete(`/treinos/${id}`);
      setToast({ msg: 'Treino excluido!', type: 'success' });
      setForm(EMPTY_TREINO); setEditId(null); setExerciciosDoTreino([]); carregar();
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao excluir', type: 'error' });
    }
    setConfirm(null);
  };

  const adicionarExercicio = async () => {
    if (!teForm.exercicio) { setToast({ msg: 'Selecione um exercicio', type: 'error' }); return; }
    try {
      const exObj = exerciciosDisponiveis.find((e) => String(e.idExercicio) === String(teForm.exercicio));
      await api.post(`/treinos/${editId}/exercicios`, {
        exercicio: exObj,
        series: parseInt(teForm.series) || 3,
        repeticoes: parseInt(teForm.repeticoes) || 12,
        cargaSugerida: parseFloat(teForm.cargaSugerida) || null,
        descansoSegundos: parseInt(teForm.descansoSegundos) || null,
        ordem: parseInt(teForm.ordem) || null,
      });
      setTeForm(EMPTY_TE);
      carregarExercicios(editId);
      setToast({ msg: 'Exercicio adicionado!', type: 'success' });
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao adicionar', type: 'error' });
    }
  };

  const removerExercicio = async (idExercicio) => {
    try {
      await api.delete(`/treinos/${editId}/exercicios/${idExercicio}`);
      carregarExercicios(editId);
      setToast({ msg: 'Exercicio removido!', type: 'success' });
    } catch (err) {
      setToast({ msg: err.response?.data?.erro || 'Erro ao remover', type: 'error' });
    }
  };

  const novoTreino = () => {
    setForm(EMPTY_TREINO); setEditId(null); setExerciciosDoTreino([]); setTeForm(EMPTY_TE);
  };

  return (
    <>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
      <ConfirmDialog show={!!confirm} title="Confirmar Exclusao"
        message="Tem certeza que deseja excluir este treino e seus exercicios?" onCancel={() => setConfirm(null)}
        onConfirm={() => excluir(confirm)} />

      <div className="card">
        <h3>Treinos</h3>
        <table className="data-table">
          <thead><tr><th>Nome</th><th>Objetivo</th><th>Nivel</th><th>Acoes</th></tr></thead>
          <tbody>
            {treinos.length === 0 && <tr><td colSpan="4" className="empty">Nenhum treino cadastrado.</td></tr>}
            {treinos.map((t) => (
              <tr key={t.idTreino}>
                <td>{t.nome}</td>
                <td>{t.objetivo}</td>
                <td><span className={`badge-nivel badge-nivel-${t.nivel || ''}`}>{NIVEL_LABEL[t.nivel] || ''}</span></td>
                <td className="actions">
                  <button className="link-edit" onClick={() => editar(t)}>Editar</button>
                  <button className="link-delete" onClick={() => setConfirm(t.idTreino)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>{editId ? 'Editar Treino' : 'Cadastro de Treino'}</h3>
        <form className="form-grid" onSubmit={salvar}>
          <label>Nome:</label>
          <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required placeholder="Ex: Treino A - Peito" />
          <label>Objetivo:</label>
          <input type="text" value={form.objetivo} onChange={(e) => setForm({ ...form, objetivo: e.target.value })} placeholder="Ex: Hipertrofia" />
          <label>Nivel:</label>
          <select value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })}>
            <option value="">-- Selecione --</option>
            {NIVEIS.map((n) => <option key={n} value={n}>{NIVEL_LABEL[n]}</option>)}
          </select>
          <div></div>
          <div className="btn-group">
            <button type="submit" className="btn btn-save">{editId ? 'Atualizar' : 'Salvar'}</button>
            <button type="button" className="btn btn-cancel" onClick={novoTreino}>Limpar</button>
          </div>
        </form>
      </div>

      {editId && (
        <div className="card">
          <h3>Exercicios do Treino</h3>
          <div className="exercicio-form-grid">
            <div className="exercicio-form-item">
              <label>Exercicio:</label>
              <select value={teForm.exercicio} onChange={(e) => setTeForm({ ...teForm, exercicio: e.target.value })}>
                <option value="">-- Selecione --</option>
                {exerciciosDisponiveis.map((ex) => <option key={ex.idExercicio} value={ex.idExercicio}>{ex.nome}</option>)}
              </select>
            </div>
            <div className="exercicio-form-item">
              <label>Series:</label>
              <input type="number" min="1" value={teForm.series} onChange={(e) => setTeForm({ ...teForm, series: e.target.value })} placeholder="3" style={{maxWidth:80}} />
            </div>
            <div className="exercicio-form-item">
              <label>Reps:</label>
              <input type="number" min="1" value={teForm.repeticoes} onChange={(e) => setTeForm({ ...teForm, repeticoes: e.target.value })} placeholder="12" style={{maxWidth:80}} />
            </div>
            <div className="exercicio-form-item">
              <label>Carga (kg):</label>
              <input type="number" min="0" step="0.5" value={teForm.cargaSugerida} onChange={(e) => setTeForm({ ...teForm, cargaSugerida: e.target.value })} placeholder="20" style={{maxWidth:90}} />
            </div>
            <div className="exercicio-form-item">
              <label>Descanso (s):</label>
              <input type="number" min="0" value={teForm.descansoSegundos} onChange={(e) => setTeForm({ ...teForm, descansoSegundos: e.target.value })} placeholder="60" style={{maxWidth:80}} />
            </div>
            <div className="exercicio-form-item">
              <label>Ordem:</label>
              <input type="number" min="1" value={teForm.ordem} onChange={(e) => setTeForm({ ...teForm, ordem: e.target.value })} placeholder="1" style={{maxWidth:70}} />
            </div>
          </div>
          <div className="btn-group">
            <button type="button" className="btn btn-add" onClick={adicionarExercicio}>Adicionar</button>
          </div>

          <table className="data-table" style={{marginTop:16}}>
            <thead><tr><th>Exercicio</th><th>Series</th><th>Reps</th><th>Carga</th><th>Descanso</th><th>Ordem</th><th></th></tr></thead>
            <tbody>
              {exerciciosDoTreino.length === 0 && <tr><td colSpan="7" className="empty">Nenhum exercicio vinculado.</td></tr>}
              {exerciciosDoTreino.map((te) => (
                <tr key={te.id?.idExercicio || te.exercicio?.idExercicio}>
                  <td>{te.exercicio?.nome}</td>
                  <td style={{textAlign:'center'}}>{te.series}</td>
                  <td style={{textAlign:'center'}}>{te.repeticoes}</td>
                  <td style={{textAlign:'center'}}>{te.cargaSugerida ? `${te.cargaSugerida} kg` : ''}</td>
                  <td style={{textAlign:'center'}}>{te.descansoSegundos ? `${te.descansoSegundos}s` : ''}</td>
                  <td style={{textAlign:'center'}}>{te.ordem}</td>
                  <td className="actions">
                    <button className="link-delete" onClick={() => removerExercicio(te.exercicio?.idExercicio || te.id?.idExercicio)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
