package rest;

import model.Matricula;
import model.StatusMatricula;
import rest.dto.DashboardResponse;
import service.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

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

    @GET
    @Path("/ultimas-matriculas")
    public Response ultimasMatriculas(@QueryParam("limite") @DefaultValue("5") int limite) {
        limite = Math.max(1, Math.min(limite, 50));
        List<Matricula> ultimas = matriculaService.buscarUltimas(limite);
        return Response.ok(ultimas).build();
    }

    @GET
    @Path("/proximos-vencimentos")
    public Response proximosVencimentos(@QueryParam("dias") @DefaultValue("30") int dias) {
        dias = Math.max(1, Math.min(dias, 365));
        List<Matricula> vencimentos = matriculaService.buscarProximosVencimentos(dias);
        return Response.ok(vencimentos).build();
    }
}
