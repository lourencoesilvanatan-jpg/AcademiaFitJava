package service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import javax.enterprise.context.ApplicationScoped;
import dao.UsuarioDAO;
import model.Usuario;

@ApplicationScoped
public class UsuarioService {

    private UsuarioDAO usuarioDAO;

    public UsuarioService() {
        this.usuarioDAO = new UsuarioDAO();
    }

    public Usuario autenticar(String login, String senha) {
        Usuario usuario = usuarioDAO.buscarPorLogin(login);
        if (usuario != null && usuario.getSenha().equals(hashSenha(senha))) {
            return usuario;
        }
        return null;
    }

    public Usuario salvar(Usuario usuario) {
        usuario.setSenha(hashSenha(usuario.getSenha()));
        if (usuario.getIdUsuario() == null) {
            usuarioDAO.salvar(usuario);
            return usuario;
        } else {
            return usuarioDAO.atualizar(usuario);
        }
    }

    public void criarUsuarioPadrao() {
        if (usuarioDAO.contarTodos() == 0) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setLogin("admin");
            admin.setSenha(hashSenha("admin123"));
            admin.setAtivo(true);
            usuarioDAO.salvar(admin);
        }
    }

    public List<Usuario> listarTodos() {
        return usuarioDAO.buscarTodos();
    }

    private String hashSenha(String senha) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(senha.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash da senha", e);
        }
    }
}
