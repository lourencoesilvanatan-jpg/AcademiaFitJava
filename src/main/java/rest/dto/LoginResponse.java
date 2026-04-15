package rest.dto;

public class LoginResponse {
    private String token;
    private String nome;
    private String login;

    public LoginResponse(String token, String nome, String login) {
        this.token = token;
        this.nome = nome;
        this.login = login;
    }

    public String getToken() { return token; }
    public String getNome() { return nome; }
    public String getLogin() { return login; }
}
