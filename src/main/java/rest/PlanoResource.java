package rest;

import model.Plano;
import rest.dto.ErrorResponse;
import rest.dto.PageResponse;
import service.PlanoService;
import util.ErrorMessages;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/planos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PlanoResource {

    private PlanoService planoService = new PlanoService();

    @GET
    public Response listar(@QueryParam("nome") String nome,
                           @QueryParam("page") @DefaultValue("0") int page,
                           @QueryParam("size") @DefaultValue("10") int size) {
        page = Math.max(0, page);
        size = Math.max(1, Math.min(size, 10000));
        boolean filtrando = nome != null && !nome.trim().isEmpty();
        long total = filtrando ? planoService.contarPorNome(nome) : planoService.contarTodos();
        List<Plano> content = filtrando
                ? planoService.buscarPorNomePaginado(nome, page, size)
                : planoService.listarPaginado(page, size);
        return Response.ok(new PageResponse<>(content, total, page, size)).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        Plano plano = planoService.buscarPorId(id);
        if (plano == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Plano nao encontrado")).build();
        }
        return Response.ok(plano).build();
    }

    @POST
    public Response criar(Plano plano) {
        try {
            plano.setIdPlano(null);
            Plano salvo = planoService.salvar(plano);
            return Response.status(Response.Status.CREATED).entity(salvo).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(ErrorMessages.extract(e))).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, Plano plano) {
        try {
            if (planoService.buscarPorId(id) == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Plano nao encontrado")).build();
            }
            plano.setIdPlano(id);
            Plano atualizado = planoService.salvar(plano);
            return Response.ok(atualizado).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(ErrorMessages.extract(e))).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response excluir(@PathParam("id") Long id) {
        try {
            Plano plano = planoService.buscarPorId(id);
            if (plano == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Plano nao encontrado")).build();
            }
            planoService.excluir(plano);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(ErrorMessages.extract(e))).build();
        }
    }
}
