package service;

import java.util.List;
import dao.PlanoDAO;
import model.Plano;

public class PlanoService {

    private PlanoDAO planoDAO;

    public PlanoService() {
        this.planoDAO = new PlanoDAO();
    }

    public Plano salvar(Plano plano) {
        if (plano.getIdPlano() == null) {
            planoDAO.salvar(plano);
            return plano;
        } else {
            return planoDAO.atualizar(plano);
        }
    }

    public void excluir(Plano plano) {
        if (plano.getIdPlano() != null)
            planoDAO.remover(plano.getIdPlano());
    }

    public Plano buscarPorId(Long id) {
        return planoDAO.buscarPorId(id);
    }

    public List<Plano> listarTodos() {
        return planoDAO.buscarTodos();
    }

    public List<Plano> listarPaginado(int page, int size) {
        return planoDAO.buscarPaginado(page, size, "idPlano");
    }

    public long contarTodos() {
        return planoDAO.contarTodos();
    }

    public List<Plano> buscarPorNomePaginado(String nome, int page, int size) {
        return planoDAO.buscarPorNomePaginado(nome, page, size);
    }

    public long contarPorNome(String nome) {
        return planoDAO.contarPorNome(nome);
    }
}
