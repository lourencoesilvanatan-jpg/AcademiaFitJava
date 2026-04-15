package rest;

import model.NivelTreino;
import model.Treino;
import model.TreinoExercicio;
import model.TreinoExercicioId;
import rest.dto.ErrorResponse;
import service.TreinoExercicioService;
import service.TreinoService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Path("/treinos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TreinoResource {

    private TreinoService treinoService = new TreinoService();
    private TreinoExercicioService teService = new TreinoExercicioService();

    @GET
    public Response listar() {
        List<Treino> treinos = treinoService.listarTodos();
        return Response.ok(treinos).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        Treino treino = treinoService.buscarPorId(id);
        if (treino == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Treino nao encontrado")).build();
        }
        return Response.ok(treino).build();
    }

    @GET
    @Path("/niveis")
    public Response listarNiveis() {
        var niveis = Arrays.stream(NivelTreino.values())
                .map(n -> new String[]{n.name(), n.getDescricao()})
                .collect(Collectors.toList());
        return Response.ok(niveis).build();
    }

    @POST
    public Response criar(Treino treino) {
        try {
            treino.setIdTreino(null);
            Treino salvo = treinoService.salvar(treino);
            return Response.status(Response.Status.CREATED).entity(salvo).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, Treino treino) {
        try {
            if (treinoService.buscarPorId(id) == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Treino nao encontrado")).build();
            }
            treino.setIdTreino(id);
            Treino atualizado = treinoService.salvar(treino);
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
            Treino treino = treinoService.buscarPorId(id);
            if (treino == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Treino nao encontrado")).build();
            }
            treinoService.excluir(treino);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    // === Exercicios do Treino ===

    @GET
    @Path("/{id}/exercicios")
    public Response listarExercicios(@PathParam("id") Long id) {
        List<TreinoExercicio> exercicios = teService.buscarPorTreino(id);
        return Response.ok(exercicios).build();
    }

    @POST
    @Path("/{id}/exercicios")
    public Response adicionarExercicio(@PathParam("id") Long id, TreinoExercicio te) {
        try {
            Treino treino = treinoService.buscarPorId(id);
            if (treino == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Treino nao encontrado")).build();
            }
            te.setTreino(treino);
            TreinoExercicio salvo = teService.salvar(te);
            return Response.status(Response.Status.CREATED).entity(salvo).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @DELETE
    @Path("/{idTreino}/exercicios/{idExercicio}")
    public Response removerExercicio(@PathParam("idTreino") Long idTreino,
                                     @PathParam("idExercicio") Long idExercicio) {
        try {
            teService.remover(new TreinoExercicioId(idTreino, idExercicio));
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
}
