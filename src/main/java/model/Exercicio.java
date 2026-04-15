package model;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exercicio")
public class Exercicio implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_exercicio")
    private Long idExercicio;

    @NotBlank(message = "Nome e obrigatorio")
    @Size(min = 2, max = 255, message = "Nome deve ter entre 2 e 255 caracteres")
    @Column(nullable = false, length = 255)
    private String nome;

    @Column(name = "grupo_muscular", length = 30)
    private GrupoMuscular grupoMuscular;

    @Size(max = 500, message = "Descricao deve ter no maximo 500 caracteres")
    @Column(length = 500)
    private String descricao;

    @JsonIgnore
    @OneToMany(mappedBy = "exercicio", fetch = FetchType.LAZY)
    private List<TreinoExercicio> treinoExercicios = new ArrayList<>();

    public Exercicio() {}

    public Long getIdExercicio() { return idExercicio; }
    public void setIdExercicio(Long idExercicio) { this.idExercicio = idExercicio; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public GrupoMuscular getGrupoMuscular() { return grupoMuscular; }
    public void setGrupoMuscular(GrupoMuscular grupoMuscular) { this.grupoMuscular = grupoMuscular; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public List<TreinoExercicio> getTreinoExercicios() { return treinoExercicios; }
    public void setTreinoExercicios(List<TreinoExercicio> treinoExercicios) { this.treinoExercicios = treinoExercicios; }

    @Override
    public int hashCode() { return idExercicio != null ? idExercicio.hashCode() : 0; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Exercicio ex = (Exercicio) o;
        return idExercicio != null && idExercicio.equals(ex.idExercicio);
    }
}
