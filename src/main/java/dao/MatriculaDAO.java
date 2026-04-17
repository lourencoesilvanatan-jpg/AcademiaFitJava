package dao;

import model.Matricula;
import model.StatusMatricula;
import util.JPAUtil;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.util.List;

public class MatriculaDAO extends GenericDAO<Matricula> {

    public MatriculaDAO() {
        super(Matricula.class);
    }

    public List<Matricula> buscarPorAluno(Long idAluno) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT m FROM Matricula m WHERE m.aluno.idAluno = :idAluno ORDER BY m.idMatricula", Matricula.class)
                    .setParameter("idAluno", idAluno)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public List<Matricula> buscarPorAlunoPaginado(Long idAluno, int pagina, int tamanhoPagina) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT m FROM Matricula m WHERE m.aluno.idAluno = :idAluno ORDER BY m.idMatricula", Matricula.class)
                    .setParameter("idAluno", idAluno)
                    .setFirstResult(pagina * tamanhoPagina)
                    .setMaxResults(tamanhoPagina)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public long contarPorAluno(Long idAluno) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT COUNT(m) FROM Matricula m WHERE m.aluno.idAluno = :idAluno", Long.class)
                    .setParameter("idAluno", idAluno)
                    .getSingleResult();
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

    public List<Matricula> buscarUltimas(int limite) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT m FROM Matricula m ORDER BY m.idMatricula DESC", Matricula.class)
                    .setMaxResults(limite)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public List<Matricula> buscarPorAlunoNomePaginado(String nome, int pagina, int tamanhoPagina) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT m FROM Matricula m WHERE LOWER(m.aluno.nome) LIKE :nome ORDER BY m.idMatricula", Matricula.class)
                    .setParameter("nome", "%" + nome.toLowerCase() + "%")
                    .setFirstResult(pagina * tamanhoPagina)
                    .setMaxResults(tamanhoPagina)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public long contarPorAlunoNome(String nome) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT COUNT(m) FROM Matricula m WHERE LOWER(m.aluno.nome) LIKE :nome", Long.class)
                    .setParameter("nome", "%" + nome.toLowerCase() + "%")
                    .getSingleResult();
        } finally {
            em.close();
        }
    }

    public List<Matricula> buscarProximosVencimentos(int dias) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            LocalDate hoje = LocalDate.now();
            LocalDate limite = hoje.plusDays(dias);
            return em.createQuery(
                    "SELECT m FROM Matricula m "
                    + "WHERE m.status = :ativa AND m.dataFim IS NOT NULL "
                    + "AND m.dataFim BETWEEN :hoje AND :limite "
                    + "ORDER BY m.dataFim ASC", Matricula.class)
                    .setParameter("ativa", StatusMatricula.ATIVA)
                    .setParameter("hoje", hoje)
                    .setParameter("limite", limite)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public int marcarExpiradas() {
        return executarDentroTransacaoComRetorno(em -> em.createQuery(
                "UPDATE Matricula m SET m.status = :expirada "
                + "WHERE m.status = :ativa AND m.dataFim IS NOT NULL AND m.dataFim < :hoje")
                .setParameter("expirada", StatusMatricula.EXPIRADA)
                .setParameter("ativa", StatusMatricula.ATIVA)
                .setParameter("hoje", LocalDate.now())
                .executeUpdate());
    }
}
