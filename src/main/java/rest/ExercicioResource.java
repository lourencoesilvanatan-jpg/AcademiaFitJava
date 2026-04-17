package rest;

import model.Exercicio;
import model.GrupoMuscular;
import rest.dto.ErrorResponse;
import rest.dto.PageResponse;
import service.ExercicioService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Path("/exercicios")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ExercicioResource {

    private ExercicioService exercicioService = new ExercicioService();

    @GET
    public Response listar(@QueryParam("page") @DefaultValue("0") int page,
                           @QueryParam("size") @DefaultValue("10") int size) {
        page = Math.max(0, page);
        size = Math.max(1, Math.min(size, 10000));
        long total = exercicioService.contarTodos();
        List<Exercicio> content = exercicioService.listarPaginado(page, size);
        return Response.ok(new PageResponse<>(content, total, page, size)).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        Exercicio ex = exercicioService.buscarPorId(id);
        if (ex == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Exercicio nao encontrado")).build();
        }
        return Response.ok(ex).build();
    }

    @GET
    @Path("/grupos-musculares")
    public Response listarGrupos() {
        var grupos = Arrays.stream(GrupoMuscular.values())
                .map(g -> new String[]{g.name(), g.getDescricao()})
                .collect(Collectors.toList());
        return Response.ok(grupos).build();
    }

    @POST
    public Response criar(Exercicio exercicio) {
        try {
            exercicio.setIdExercicio(null);
            Exercicio salvo = exercicioService.salvar(exercicio);
            return Response.status(Response.Status.CREATED).entity(salvo).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, Exercicio exercicio) {
        try {
            if (exercicioService.buscarPorId(id) == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Exercicio nao encontrado")).build();
            }
            exercicio.setIdExercicio(id);
            Exercicio atualizado = exercicioService.salvar(exercicio);
            return Response.ok(atualizado).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response excluir(@PathParam("id") Long id) {
        try {
            Exercicio ex = exercicioService.buscarPorId(id);
            if (ex == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Exercicio nao encontrado")).build();
            }
            exercicioService.excluir(ex);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
}
