package model;

import javax.persistence.*;
import java.io.Serializable;

@Embeddable
public class TreinoExercicioId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "id_treino")
    private Long idTreino;

    @Column(name = "id_exercicio")
    private Long idExercicio;

    public TreinoExercicioId() {}

    public TreinoExercicioId(Long idTreino, Long idExercicio) {
        this.idTreino = idTreino;
        this.idExercicio = idExercicio;
    }

    public Long getIdTreino() { return idTreino; }
    public void setIdTreino(Long idTreino) { this.idTreino = idTreino; }
    public Long getIdExercicio() { return idExercicio; }
    public void setIdExercicio(Long idExercicio) { this.idExercicio = idExercicio; }

    @Override
    public int hashCode() {
        int result = idTreino != null ? idTreino.hashCode() : 0;
        result = 31 * result + (idExercicio != null ? idExercicio.hashCode() : 0);
        return result;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TreinoExercicioId that = (TreinoExercicioId) o;
        if (idTreino != null ? !idTreino.equals(that.idTreino) : that.idTreino != null) return false;
        return idExercicio != null ? idExercicio.equals(that.idExercicio) : that.idExercicio == null;
    }
}
