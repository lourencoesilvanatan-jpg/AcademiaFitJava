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
                    "SELECT a FROM Aluno a WHERE LOWER(a.nome) LIKE :nome", Aluno.class)
                    .setParameter("nome", "%" + nome.toLowerCase() + "%")
                    .getResultList();
        } finally {
            em.close();
        }
    }
}
