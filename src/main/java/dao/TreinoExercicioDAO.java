package dao;

import model.TreinoExercicio;
import model.TreinoExercicioId;
import util.JPAUtil;

import javax.persistence.EntityManager;
import java.util.List;

public class TreinoExercicioDAO extends GenericDAO<TreinoExercicio> {

    public TreinoExercicioDAO() {
        super(TreinoExercicio.class);
    }

    public List<TreinoExercicio> buscarPorTreino(Long idTreino) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT te FROM TreinoExercicio te WHERE te.treino.idTreino = :idTreino ORDER BY te.ordem",
                    TreinoExercicio.class)
                    .setParameter("idTreino", idTreino)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public void removerPorId(TreinoExercicioId id) {
        executarDentroTransacao(em -> {
            TreinoExercicio ref = em.find(TreinoExercicio.class, id);
            if (ref != null) em.remove(ref);
        });
    }
}
