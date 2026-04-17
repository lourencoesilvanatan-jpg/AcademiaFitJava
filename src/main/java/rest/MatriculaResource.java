package rest;

import model.Matricula;
import rest.dto.ErrorResponse;
import rest.dto.PageResponse;
import service.MatriculaService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/matriculas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MatriculaResource {

    private MatriculaService matriculaService = new MatriculaService();

    @GET
    public Response listar(@QueryParam("idAluno") Long idAluno,
                           @QueryParam("page") @DefaultValue("0") int page,
                           @QueryParam("size") @DefaultValue("10") int size) {
        page = Math.max(0, page);
        size = Math.max(1, Math.min(size, 10000));

        long total;
        List<Matricula> content;
        if (idAluno != null) {
            total = matriculaService.contarPorAluno(idAluno);
            content = matriculaService.buscarPorAlunoPaginado(idAluno, page, size);
        } else {
            total = matriculaService.contarTodos();
            content = matriculaService.listarPaginado(page, size);
        }
        return Response.ok(new PageResponse<>(content, total, page, size)).build();
    }

    @POST
    public Response criar(Matricula matricula) {
        try {
            matricula.setIdMatricula(null);
            Matricula salva = matriculaService.salvar(matricula);
            return Response.status(Response.Status.CREATED).entity(salva).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, Matricula matricula) {
        try {
            matricula.setIdMatricula(id);
            Matricula atualizada = matriculaService.salvar(matricula);
            return Response.ok(atualizada).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response excluir(@PathParam("id") Long id) {
        try {
            Matricula m = new Matricula();
            m.setIdMatricula(id);
            matriculaService.excluir(m);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
}
