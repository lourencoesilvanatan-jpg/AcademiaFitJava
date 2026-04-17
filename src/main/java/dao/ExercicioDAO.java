package dao;

import model.Exercicio;
import util.JPAUtil;

import javax.persistence.EntityManager;
import java.util.List;

public class ExercicioDAO extends GenericDAO<Exercicio> {

    public ExercicioDAO() {
        super(Exercicio.class);
    }

    public List<Exercicio> buscarPorNomePaginado(String nome, int pagina, int tamanhoPagina) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT e FROM Exercicio e WHERE LOWER(e.nome) LIKE :nome ORDER BY e.idExercicio", Exercicio.class)
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
                    "SELECT COUNT(e) FROM Exercicio e WHERE LOWER(e.nome) LIKE :nome", Long.class)
                    .setParameter("nome", "%" + nome.toLowerCase() + "%")
                    .getSingleResult();
        } finally {
            em.close();
        }
    }
}
