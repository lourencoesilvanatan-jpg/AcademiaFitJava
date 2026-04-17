package dao;

import model.Usuario;
import util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;

public class UsuarioDAO extends GenericDAO<Usuario> {

    public UsuarioDAO() {
        super(Usuario.class);
    }

    public Usuario buscarPorLogin(String login) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT u FROM Usuario u WHERE u.login = :login AND u.ativo = true", Usuario.class)
                    .setParameter("login", login)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        } finally {
            em.close();
        }
    }

    public long contarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("SELECT COUNT(u) FROM Usuario u", Long.class).getSingleResult();
        } finally {
            em.close();
        }
    }

    public java.util.List<model.Usuario> buscarPorNomePaginado(String nome, int pagina, int tamanhoPagina) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT u FROM Usuario u WHERE LOWER(u.nome) LIKE :termo OR LOWER(u.login) LIKE :termo ORDER BY u.idUsuario",
                    model.Usuario.class)
                    .setParameter("termo", "%" + nome.toLowerCase() + "%")
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
                    "SELECT COUNT(u) FROM Usuario u WHERE LOWER(u.nome) LIKE :termo OR LOWER(u.login) LIKE :termo",
                    Long.class)
                    .setParameter("termo", "%" + nome.toLowerCase() + "%")
                    .getSingleResult();
        } finally {
            em.close();
        }
    }
}
