package rest;

import model.Matricula;
import rest.dto.ErrorResponse;
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
    public Response listar(@QueryParam("idAluno") Long idAluno) {
        List<Matricula> matriculas;
        if (idAluno != null) {
            matriculas = matriculaService.buscarPorAluno(idAluno);
        } else {
            matriculas = matriculaService.listarTodos();
        }
        return Response.ok(matriculas).build();
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
