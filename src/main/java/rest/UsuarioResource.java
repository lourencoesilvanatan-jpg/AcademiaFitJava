package rest;

import model.Usuario;
import rest.dto.ErrorResponse;
import rest.dto.PageResponse;
import service.UsuarioService;
import util.ErrorMessages;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;
import java.util.LinkedHashMap;
import java.util.Map;

@Path("/usuarios")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UsuarioResource {

    private UsuarioService usuarioService = new UsuarioService();

    @GET
    public Response listar(@QueryParam("page") @DefaultValue("0") int page,
                           @QueryParam("size") @DefaultValue("10") int size) {
        page = Math.max(0, page);
        size = Math.max(1, Math.min(size, 10000));
        long total = usuarioService.contarTodos();
        List<Map<String, Object>> content = usuarioService.listarPaginado(page, size).stream().map(u -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("idUsuario", u.getIdUsuario());
            map.put("nome", u.getNome());
            map.put("login", u.getLogin());
            map.put("ativo", u.isAtivo());
            return map;
        }).collect(Collectors.toList());
        return Response.ok(new PageResponse<>(content, total, page, size)).build();
    }

    @POST
    public Response criar(Map<String, String> dados) {
        try {
            String nome = dados.get("nome");
            String login = dados.get("login");
            String senha = dados.get("senha");

            if (nome == null || nome.isBlank() || login == null || login.isBlank() || senha == null || senha.isBlank()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse("Nome, login e senha sao obrigatorios")).build();
            }

            Usuario usuario = new Usuario();
            usuario.setNome(nome);
            usuario.setLogin(login);
            usuario.setSenha(senha);
            usuario.setAtivo(true);

            Usuario salvo = usuarioService.salvar(usuario);

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("idUsuario", salvo.getIdUsuario());
            result.put("nome", salvo.getNome());
            result.put("login", salvo.getLogin());
            result.put("ativo", salvo.isAtivo());

            return Response.status(Response.Status.CREATED).entity(result).build();
        } catch (Exception e) {
            String msg = ErrorMessages.extract(e);
            if (msg != null && msg.toLowerCase().contains("duplicate")) {
                msg = "Login ja esta em uso";
            }
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(msg)).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, Map<String, String> dados) {
        try {
            List<Usuario> todos = usuarioService.listarTodos();
            Usuario existente = todos.stream().filter(u -> u.getIdUsuario().equals(id)).findFirst().orElse(null);

            if (existente == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Usuario nao encontrado")).build();
            }

            String nome = dados.get("nome");
            String login = dados.get("login");
            String senha = dados.get("senha");

            if (nome != null && !nome.isBlank()) existente.setNome(nome);
            if (login != null && !login.isBlank()) existente.setLogin(login);

            if (senha != null && !senha.isBlank()) {
                existente.setSenha(senha);
                Usuario atualizado = usuarioService.salvar(existente);
                Map<String, Object> result = new LinkedHashMap<>();
                result.put("idUsuario", atualizado.getIdUsuario());
                result.put("nome", atualizado.getNome());
                result.put("login", atualizado.getLogin());
                result.put("ativo", atualizado.isAtivo());
                return Response.ok(result).build();
            } else {
                // Update without changing password - need direct DAO update
                dao.UsuarioDAO dao = new dao.UsuarioDAO();
                existente = dao.atualizar(existente);
                Map<String, Object> result = new LinkedHashMap<>();
                result.put("idUsuario", existente.getIdUsuario());
                result.put("nome", existente.getNome());
                result.put("login", existente.getLogin());
                result.put("ativo", existente.isAtivo());
                return Response.ok(result).build();
            }
        } catch (Exception e) {
            String msg = ErrorMessages.extract(e);
            if (msg != null && msg.toLowerCase().contains("duplicate")) {
                msg = "Login ja esta em uso";
            }
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(msg)).build();
        }
    }

    @PUT
    @Path("/{id}/toggle")
    public Response toggleAtivo(@PathParam("id") Long id) {
        try {
            List<Usuario> todos = usuarioService.listarTodos();
            Usuario existente = todos.stream().filter(u -> u.getIdUsuario().equals(id)).findFirst().orElse(null);

            if (existente == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Usuario nao encontrado")).build();
            }

            existente.setAtivo(!existente.isAtivo());
            dao.UsuarioDAO dao = new dao.UsuarioDAO();
            existente = dao.atualizar(existente);

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("idUsuario", existente.getIdUsuario());
            result.put("nome", existente.getNome());
            result.put("login", existente.getLogin());
            result.put("ativo", existente.isAtivo());
            return Response.ok(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(ErrorMessages.extract(e))).build();
        }
    }
}
