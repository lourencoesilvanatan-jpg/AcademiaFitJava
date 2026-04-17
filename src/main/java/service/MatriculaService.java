package service;

import java.util.List;
import dao.MatriculaDAO;
import model.Matricula;
import model.StatusMatricula;

public class MatriculaService {

    private MatriculaDAO matriculaDAO;

    public MatriculaService() {
        this.matriculaDAO = new MatriculaDAO();
    }

    public Matricula salvar(Matricula matricula) {
        if (matricula.getDataInicio() != null && matricula.getPlano() != null
                && matricula.getPlano().getDuracaoDias() != null && matricula.getDataFim() == null) {
            matricula.setDataFim(matricula.getDataInicio().plusDays(matricula.getPlano().getDuracaoDias()));
        }

        if (matricula.getIdMatricula() == null) {
            matriculaDAO.salvar(matricula);
            return matricula;
        } else {
            return matriculaDAO.atualizar(matricula);
        }
    }

    public void excluir(Matricula matricula) {
        if (matricula.getIdMatricula() != null)
            matriculaDAO.remover(matricula.getIdMatricula());
    }

    public List<Matricula> listarTodos() {
        return matriculaDAO.buscarTodos();
    }

    public List<Matricula> buscarPorAluno(Long idAluno) {
        return matriculaDAO.buscarPorAluno(idAluno);
    }

    public List<Matricula> listarPaginado(int page, int size) {
        return matriculaDAO.buscarPaginado(page, size, "idMatricula");
    }

    public List<Matricula> buscarPorAlunoPaginado(Long idAluno, int page, int size) {
        return matriculaDAO.buscarPorAlunoPaginado(idAluno, page, size);
    }

    public long contarPorAluno(Long idAluno) {
        return matriculaDAO.contarPorAluno(idAluno);
    }

    public long contarPorStatus(StatusMatricula status) {
        return matriculaDAO.contarPorStatus(status);
    }

    public long contarTodos() {
        return matriculaDAO.contarTodos();
    }

    public List<Matricula> buscarUltimas(int limite) {
        return matriculaDAO.buscarUltimas(limite);
    }

    public List<Matricula> buscarProximosVencimentos(int dias) {
        return matriculaDAO.buscarProximosVencimentos(dias);
    }

    public List<Matricula> buscarPorAlunoNomePaginado(String nome, int page, int size) {
        return matriculaDAO.buscarPorAlunoNomePaginado(nome, page, size);
    }

    public long contarPorAlunoNome(String nome) {
        return matriculaDAO.contarPorAlunoNome(nome);
    }
}
