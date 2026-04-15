package dao;

import model.Matricula;
import model.StatusMatricula;
import util.JPAUtil;

import javax.persistence.EntityManager;
import java.util.List;

public class MatriculaDAO extends GenericDAO<Matricula> {

    public MatriculaDAO() {
        super(Matricula.class);
    }

    public List<Matricula> buscarPorAluno(Long idAluno) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT m FROM Matricula m WHERE m.aluno.idAluno = :idAluno", Matricula.class)
                    .setParameter("idAluno", idAluno)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public long contarPorStatus(StatusMatricula status) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT COUNT(m) FROM Matricula m WHERE m.status = :status", Long.class)
                    .setParameter("status", status)
                    .getSingleResult();
        } finally {
            em.close();
        }
    }
}
