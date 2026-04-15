package service;

import java.util.List;
import javax.enterprise.context.ApplicationScoped;
import dao.TreinoExercicioDAO;
import model.TreinoExercicio;
import model.TreinoExercicioId;

@ApplicationScoped
public class TreinoExercicioService {

    private TreinoExercicioDAO treinoExercicioDAO;

    public TreinoExercicioService() {
        this.treinoExercicioDAO = new TreinoExercicioDAO();
    }

    public TreinoExercicio salvar(TreinoExercicio te) {
        TreinoExercicioId id = te.getId();
        if (id != null && id.getIdTreino() != null && id.getIdExercicio() != null) {
            TreinoExercicio existente = treinoExercicioDAO.buscarPorId(id);
            if (existente != null) {
                return treinoExercicioDAO.atualizar(te);
            }
        }
        return treinoExercicioDAO.atualizar(te);
    }

    public TreinoExercicio atualizar(TreinoExercicio te) {
        return treinoExercicioDAO.atualizar(te);
    }

    public void remover(TreinoExercicioId id) {
        treinoExercicioDAO.removerPorId(id);
    }

    public List<TreinoExercicio> buscarPorTreino(Long idTreino) {
        return treinoExercicioDAO.buscarPorTreino(idTreino);
    }

    public List<TreinoExercicio> listarTodos() {
        return treinoExercicioDAO.buscarTodos();
    }
}
