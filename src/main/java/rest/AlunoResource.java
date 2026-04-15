package rest;

import model.Aluno;
import rest.dto.ErrorResponse;
import service.AlunoService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/alunos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AlunoResource {

    private AlunoService alunoService = new AlunoService();

    @GET
    public Response listar(@QueryParam("nome") String nome) {
        List<Aluno> alunos = alunoService.buscarPorNome(nome);
        return Response.ok(alunos).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        Aluno aluno = alunoService.buscarPorId(id);
        if (aluno == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Aluno nao encontrado")).build();
        }
        return Response.ok(aluno).build();
    }

    @POST
    public Response criar(Aluno aluno) {
        try {
            aluno.setIdAluno(null);
            Aluno salvo = alunoService.salvar(aluno);
            return Response.status(Response.Status.CREATED).entity(salvo).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, Aluno aluno) {
        try {
            Aluno existente = alunoService.buscarPorId(id);
            if (existente == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Aluno nao encontrado")).build();
            }
            aluno.setIdAluno(id);
            Aluno atualizado = alunoService.salvar(aluno);
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
            Aluno aluno = alunoService.buscarPorId(id);
            if (aluno == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Aluno nao encontrado")).build();
            }
            alunoService.excluir(aluno);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
}
