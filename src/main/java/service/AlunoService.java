package service;

import java.util.List;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import dao.AlunoDAO;
import model.Aluno;

@ApplicationScoped
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

    public long contarTodos() {
        return alunoDAO.contarTodos();
    }
}
