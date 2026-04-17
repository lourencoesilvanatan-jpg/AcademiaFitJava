package dao;

import model.Plano;
import util.JPAUtil;

import javax.persistence.EntityManager;
import java.util.List;

public class PlanoDAO extends GenericDAO<Plano> {

    public PlanoDAO() {
        super(Plano.class);
    }

    public List<Plano> buscarPorNomePaginado(String nome, int pagina, int tamanhoPagina) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT p FROM Plano p WHERE LOWER(p.nome) LIKE :nome ORDER BY p.idPlano", Plano.class)
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
                    "SELECT COUNT(p) FROM Plano p WHERE LOWER(p.nome) LIKE :nome", Long.class)
                    .setParameter("nome", "%" + nome.toLowerCase() + "%")
                    .getSingleResult();
        } finally {
            em.close();
        }
    }
}
