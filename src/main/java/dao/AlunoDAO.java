package dao;

import model.Aluno;
import util.JPAUtil;

import javax.persistence.EntityManager;
import java.util.List;

public class AlunoDAO extends GenericDAO<Aluno> {

    public AlunoDAO() {
        super(Aluno.class);
    }

    public List<Aluno> buscarPorNome(String nome) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT a FROM Aluno a WHERE LOWER(a.nome) LIKE :nome ORDER BY a.idAluno", Aluno.class)
                    .setParameter("nome", "%" + nome.toLowerCase() + "%")
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public List<Aluno> buscarPorNomePaginado(String nome, int pagina, int tamanhoPagina) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT a FROM Aluno a WHERE LOWER(a.nome) LIKE :nome ORDER BY a.idAluno", Aluno.class)
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
                    "SELECT COUNT(a) FROM Aluno a WHERE LOWER(a.nome) LIKE :nome", Long.class)
                    .setParameter("nome", "%" + nome.toLowerCase() + "%")
                    .getSingleResult();
        } finally {
            em.close();
        }
    }
}
