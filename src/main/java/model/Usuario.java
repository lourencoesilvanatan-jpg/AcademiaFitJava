package model;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;

@Entity
@Table(name = "usuario")
public class Usuario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @NotBlank(message = "Nome e obrigatorio")
    @Column(nullable = false, length = 255)
    private String nome;

    @NotBlank(message = "Login e obrigatorio")
    @Column(nullable = false, unique = true, length = 100)
    private String login;

    @NotBlank(message = "Senha e obrigatoria")
    @Column(nullable = false, length = 255)
    private String senha;

    @Column(nullable = false)
    private boolean ativo = true;

    public Usuario() {}

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }

    @Override
    public int hashCode() { return idUsuario != null ? idUsuario.hashCode() : 0; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuario u = (Usuario) o;
        return idUsuario != null && idUsuario.equals(u.idUsuario);
    }
}
