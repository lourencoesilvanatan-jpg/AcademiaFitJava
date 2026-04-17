package service;

import java.util.List;
import dao.TreinoDAO;
import model.Treino;

public class TreinoService {

    private TreinoDAO treinoDAO;

    public TreinoService() {
        this.treinoDAO = new TreinoDAO();
    }

    public Treino salvar(Treino treino) {
        if (treino.getIdTreino() == null) {
            treinoDAO.salvar(treino);
            return treino;
        } else {
            return treinoDAO.atualizar(treino);
        }
    }

    public void excluir(Treino treino) {
        if (treino.getIdTreino() != null)
            treinoDAO.remover(treino.getIdTreino());
    }

    public List<Treino> listarTodos() {
        return treinoDAO.buscarTodos();
    }

    public List<Treino> listarPaginado(int page, int size) {
        return treinoDAO.buscarPaginado(page, size, "idTreino");
    }

    public Treino buscarPorId(Long id) {
        return treinoDAO.buscarPorId(id);
    }

    public long contarTodos() {
        return treinoDAO.contarTodos();
    }
}
