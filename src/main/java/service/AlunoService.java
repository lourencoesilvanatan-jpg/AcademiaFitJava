package service;

import java.util.List;
import dao.AlunoDAO;
import model.Aluno;

public class AlunoService {

    private AlunoDAO alunoDAO;

    public AlunoService() {
        this.alunoDAO = new AlunoDAO();
    }

    public Aluno salvar(Aluno aluno) {
        if (aluno.getIdAluno() == null) {
            alunoDAO.salvar(aluno);
            return aluno;
        } else {
            return alunoDAO.atualizar(aluno);
        }
    }

    public void excluir(Aluno aluno) {
        if (aluno.getIdAluno() != null)
            alunoDAO.remover(aluno.getIdAluno());
    }

    public List<Aluno> listarTodos() {
        return alunoDAO.buscarTodos();
    }

    public Aluno buscarPorId(Long id) {
        return alunoDAO.buscarPorId(id);
    }

    public List<Aluno> buscarPorNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            return listarTodos();
        }
        return alunoDAO.buscarPorNome(nome);
    }

    public List<Aluno> listarPaginado(int page, int size) {
        return alunoDAO.buscarPaginado(page, size, "idAluno");
    }

    public List<Aluno> buscarPorNomePaginado(String nome, int page, int size) {
        return alunoDAO.buscarPorNomePaginado(nome, page, size);
    }

    public long contarPorNome(String nome) {
        return alunoDAO.contarPorNome(nome);
    }

    public long contarTodos() {
        return alunoDAO.contarTodos();
    }
}
