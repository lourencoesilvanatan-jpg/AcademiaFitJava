package rest.dto;

public class LoginResponse {
    private Long idUsuario;
    private String nome;
    private String login;

    public LoginResponse(Long idUsuario, String nome, String login) {
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.login = login;
    }

    public Long getIdUsuario() { return idUsuario; }
    public String getNome() { return nome; }
    public String getLogin() { return login; }
}
