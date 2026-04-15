package rest;

import model.StatusMatricula;
import rest.dto.DashboardResponse;
import service.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/dashboard")
@Produces(MediaType.APPLICATION_JSON)
public class DashboardResource {

    private AlunoService alunoService = new AlunoService();
    private PlanoService planoService = new PlanoService();
    private MatriculaService matriculaService = new MatriculaService();
    private TreinoService treinoService = new TreinoService();
    private ExercicioService exercicioService = new ExercicioService();

    @GET
    public Response getDashboard() {
        DashboardResponse dto = new DashboardResponse();
        dto.setTotalAlunos(alunoService.contarTodos());
        dto.setTotalPlanos(planoService.contarTodos());
        dto.setTotalMatriculas(matriculaService.contarTodos());
        dto.setMatriculasAtivas(matriculaService.contarPorStatus(StatusMatricula.ATIVA));
        dto.setTotalTreinos(treinoService.contarTodos());
        dto.setTotalExercicios(exercicioService.contarTodos());
        return Response.ok(dto).build();
    }
}
