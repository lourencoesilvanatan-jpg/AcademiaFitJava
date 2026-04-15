package rest;

import model.Usuario;
import rest.dto.ErrorResponse;
import rest.dto.LoginRequest;
import rest.dto.LoginResponse;
import service.UsuarioService;
import util.JwtUtil;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    private UsuarioService usuarioService = new UsuarioService();

    @POST
    @Path("/login")
    public Response login(LoginRequest request) {
        try {
            Usuario usuario = usuarioService.autenticar(request.getLogin(), request.getSenha());
            if (usuario == null) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(new ErrorResponse("Login ou senha invalidos"))
                        .build();
            }
            String token = JwtUtil.gerarToken(usuario.getIdUsuario(), usuario.getNome(), usuario.getLogin());
            return Response.ok(new LoginResponse(token, usuario.getNome(), usuario.getLogin())).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Erro ao autenticar: " + e.getMessage()))
                    .build();
        }
    }
}
