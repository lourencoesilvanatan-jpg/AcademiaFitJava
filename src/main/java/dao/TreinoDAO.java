package dao;

import model.Treino;
import util.JPAUtil;

import javax.persistence.EntityManager;
import java.util.List;

public class TreinoDAO extends GenericDAO<Treino> {

    public TreinoDAO() {
        super(Treino.class);
    }

    public List<Treino> buscarPorNomePaginado(String nome, int pagina, int tamanhoPagina) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT t FROM Treino t WHERE LOWER(t.nome) LIKE :nome ORDER BY t.idTreino", Treino.class)
                    .setParameter("nome", "%" + nome.toLowerCase() + "%")
                    .setFirstResult(pagina * tamanhoPagina)
                    .setMaxResults(tamanhoPagina)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public long contarPorNome(String nome) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT COUNT(t) FROM Treino t WHERE LOWER(t.nome) LIKE :nome", Long.class)
                    .setParameter("nome", "%" + nome.toLowerCase() + "%")
                    .getSingleResult();
        } finally {
            em.close();
        }
    }
}
