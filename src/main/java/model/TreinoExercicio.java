package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "treino_exercicio")
public class TreinoExercicio implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
    private TreinoExercicioId id = new TreinoExercicioId();

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("idTreino")
    @JoinColumn(name = "id_treino")
    private Treino treino;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("idExercicio")
    @JoinColumn(name = "id_exercicio")
    private Exercicio exercicio;

    @NotNull(message = "Series e obrigatorio")
    @Min(value = 1, message = "Series deve ser no minimo 1")
    @Column(nullable = false)
    private Integer series;

    @NotNull(message = "Repeticoes e obrigatorio")
    @Min(value = 1, message = "Repeticoes deve ser no minimo 1")
    @Column(nullable = false)
    private Integer repeticoes;

    @DecimalMin(value = "0.0", message = "Carga nao pode ser negativa")
    @Column(name = "carga_sugerida", precision = 10, scale = 2)
    private BigDecimal cargaSugerida;

    @Min(value = 0, message = "Descanso nao pode ser negativo")
    @Column(name = "descanso_segundos")
    private Integer descansoSegundos;

    @Min(value = 1, message = "Ordem deve ser no minimo 1")
    @Column
    private Integer ordem;

    public TreinoExercicio() {}

    public TreinoExercicioId getId() { return id; }
    public void setId(TreinoExercicioId id) { this.id = id; }
    public Treino getTreino() { return treino; }
    public void setTreino(Treino treino) { this.treino = treino; }
    public Exercicio getExercicio() { return exercicio; }
    public void setExercicio(Exercicio exercicio) { this.exercicio = exercicio; }
    public Integer getSeries() { return series; }
    public void setSeries(Integer series) { this.series = series; }
    public Integer getRepeticoes() { return repeticoes; }
    public void setRepeticoes(Integer repeticoes) { this.repeticoes = repeticoes; }
    public BigDecimal getCargaSugerida() { return cargaSugerida; }
    public void setCargaSugerida(BigDecimal cargaSugerida) { this.cargaSugerida = cargaSugerida; }
    public Integer getDescansoSegundos() { return descansoSegundos; }
    public void setDescansoSegundos(Integer descansoSegundos) { this.descansoSegundos = descansoSegundos; }
    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }

    @Override
    public int hashCode() { return id != null ? id.hashCode() : 0; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TreinoExercicio that = (TreinoExercicio) o;
        return id != null && id.equals(that.id);
    }
}
