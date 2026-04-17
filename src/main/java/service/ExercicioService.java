package service;

import java.util.List;
import dao.ExercicioDAO;
import model.Exercicio;

public class ExercicioService {

    private ExercicioDAO exercicioDAO;

    public ExercicioService() {
        this.exercicioDAO = new ExercicioDAO();
    }

    public Exercicio salvar(Exercicio exercicio) {
        if (exercicio.getIdExercicio() == null) {
            exercicioDAO.salvar(exercicio);
            return exercicio;
        } else {
            return exercicioDAO.atualizar(exercicio);
        }
    }

    public void excluir(Exercicio exercicio) {
        if (exercicio.getIdExercicio() != null)
            exercicioDAO.remover(exercicio.getIdExercicio());
    }

    public Exercicio buscarPorId(Long id) {
        return exercicioDAO.buscarPorId(id);
    }

    public List<Exercicio> listarTodos() {
        return exercicioDAO.buscarTodos();
    }

    public List<Exercicio> listarPaginado(int page, int size) {
        return exercicioDAO.buscarPaginado(page, size, "idExercicio");
    }

    public long contarTodos() {
        return exercicioDAO.contarTodos();
    }

    public List<Exercicio> buscarPorNomePaginado(String nome, int page, int size) {
        return exercicioDAO.buscarPorNomePaginado(nome, page, size);
    }

    public long contarPorNome(String nome) {
        return exercicioDAO.contarPorNome(nome);
    }
}
