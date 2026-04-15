package model;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "treino")
public class Treino implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_treino")
    private Long idTreino;

    @NotBlank(message = "Nome e obrigatorio")
    @Size(min = 2, max = 255, message = "Nome deve ter entre 2 e 255 caracteres")
    @Column(nullable = false, length = 255)
    private String nome;

    @Size(max = 255, message = "Objetivo deve ter no maximo 255 caracteres")
    @Column(length = 255)
    private String objetivo;

    @Column(length = 20)
    private NivelTreino nivel;

    @JsonIgnore
    @OneToMany(mappedBy = "treino", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TreinoExercicio> treinoExercicios = new ArrayList<>();

    public Treino() {}

    public Long getIdTreino() { return idTreino; }
    public void setIdTreino(Long idTreino) { this.idTreino = idTreino; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getObjetivo() { return objetivo; }
    public void setObjetivo(String objetivo) { this.objetivo = objetivo; }
    public NivelTreino getNivel() { return nivel; }
    public void setNivel(NivelTreino nivel) { this.nivel = nivel; }
    public List<TreinoExercicio> getTreinoExercicios() { return treinoExercicios; }
    public void setTreinoExercicios(List<TreinoExercicio> treinoExercicios) { this.treinoExercicios = treinoExercicios; }

    @Override
    public int hashCode() { return idTreino != null ? idTreino.hashCode() : 0; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Treino treino = (Treino) o;
        return idTreino != null && idTreino.equals(treino.idTreino);
    }
}
