package dao;

import util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;

public class GenericDAO<T> {

    private final Class<T> clazz;

    public GenericDAO(Class<T> clazz) {
        this.clazz = clazz;
    }

    public void salvar(T entidade) {
        executarDentroTransacao(em -> em.persist(entidade));
    }

    public T atualizar(T entidade) {
        return executarDentroTransacaoComRetorno(em -> em.merge(entidade));
    }

    public void remover(Object id) {
        executarDentroTransacao(em -> {
            T ref = em.getReference(clazz, id);
            em.remove(ref);
        });
    }

    public T buscarPorId(Object id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(clazz, id);
        } finally {
            em.close();
        }
    }

    public List<T> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            String jpql = "SELECT e FROM " + clazz.getSimpleName() + " e";
            return em.createQuery(jpql, clazz).getResultList();
        } finally {
            em.close();
        }
    }

    public List<T> buscarPaginado(int pagina, int tamanhoPagina) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            String jpql = "SELECT e FROM " + clazz.getSimpleName() + " e";
            return em.createQuery(jpql, clazz)
                    .setFirstResult(pagina * tamanhoPagina)
                    .setMaxResults(tamanhoPagina)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public long contarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            String jpql = "SELECT COUNT(e) FROM " + clazz.getSimpleName() + " e";
            return em.createQuery(jpql, Long.class).getSingleResult();
        } finally {
            em.close();
        }
    }

    protected void executarDentroTransacao(Consumer<EntityManager> acao) {
        EntityManager em = JPAUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            acao.accept(em);
            tx.commit();
        } catch (RuntimeException ex) {
            if (tx.isActive()) tx.rollback();
            throw ex;
        } finally {
            em.close();
        }
    }

    protected <R> R executarDentroTransacaoComRetorno(Function<EntityManager, R> func) {
        EntityManager em = JPAUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            R result = func.apply(em);
            tx.commit();
            return result;
        } catch (RuntimeException ex) {
            if (tx.isActive()) tx.rollback();
            throw ex;
        } finally {
            em.close();
        }
    }
}
