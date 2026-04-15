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

    public long contarPorStatus(StatusMatricula status) {
        return matriculaDAO.contarPorStatus(status);
    }

    public long contarTodos() {
        return matriculaDAO.contarTodos();
    }
}
