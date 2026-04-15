package rest.dto;

public class DashboardResponse {
    private long totalAlunos;
    private long totalPlanos;
    private long totalMatriculas;
    private long matriculasAtivas;
    private long totalTreinos;
    private long totalExercicios;

    public long getTotalAlunos() { return totalAlunos; }
    public void setTotalAlunos(long totalAlunos) { this.totalAlunos = totalAlunos; }
    public long getTotalPlanos() { return totalPlanos; }
    public void setTotalPlanos(long totalPlanos) { this.totalPlanos = totalPlanos; }
    public long getTotalMatriculas() { return totalMatriculas; }
    public void setTotalMatriculas(long totalMatriculas) { this.totalMatriculas = totalMatriculas; }
    public long getMatriculasAtivas() { return matriculasAtivas; }
    public void setMatriculasAtivas(long matriculasAtivas) { this.matriculasAtivas = matriculasAtivas; }
    public long getTotalTreinos() { return totalTreinos; }
    public void setTotalTreinos(long totalTreinos) { this.totalTreinos = totalTreinos; }
    public long getTotalExercicios() { return totalExercicios; }
    public void setTotalExercicios(long totalExercicios) { this.totalExercicios = totalExercicios; }
}
