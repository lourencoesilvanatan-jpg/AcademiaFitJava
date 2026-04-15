package model;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "matricula")
public class Matricula implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_matricula")
    private Long idMatricula;

    @NotNull(message = "Data de inicio e obrigatoria")
    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @NotNull(message = "Status e obrigatorio")
    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private StatusMatricula status = StatusMatricula.ATIVA;

    @NotNull(message = "Aluno e obrigatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_aluno", nullable = false)
    private Aluno aluno;

    @NotNull(message = "Plano e obrigatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_plano", nullable = false)
    private Plano plano;

    public Matricula() {}

    @PrePersist
    public void calcularDataFim() {
        if (dataInicio != null && plano != null && plano.getDuracaoDias() != null && dataFim == null) {
            dataFim = dataInicio.plusDays(plano.getDuracaoDias());
        }
    }

    public Long getIdMatricula() { return idMatricula; }
    public void setIdMatricula(Long idMatricula) { this.idMatricula = idMatricula; }
    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }
    public StatusMatricula getStatus() { return status; }
    public void setStatus(StatusMatricula status) { this.status = status; }
    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }
    public Plano getPlano() { return plano; }
    public void setPlano(Plano plano) { this.plano = plano; }

    @Override
    public int hashCode() { return idMatricula != null ? idMatricula.hashCode() : 0; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Matricula m = (Matricula) o;
        return idMatricula != null && idMatricula.equals(m.idMatricula);
    }
}
