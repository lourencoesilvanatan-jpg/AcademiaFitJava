package model;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "plano")
public class Plano implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plano")
    private Long idPlano;

    @NotBlank(message = "Nome e obrigatorio")
    @Size(min = 2, max = 255, message = "Nome deve ter entre 2 e 255 caracteres")
    @Column(nullable = false, length = 255)
    private String nome;

    @NotNull(message = "Valor e obrigatorio")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @NotNull(message = "Duracao e obrigatoria")
    @Min(value = 1, message = "Duracao deve ser de pelo menos 1 dia")
    @Column(name = "duracao_dias", nullable = false)
    private Integer duracaoDias;

    @Size(max = 500, message = "Descricao deve ter no maximo 500 caracteres")
    @Column(length = 500)
    private String descricao;

    @JsonIgnore
    @OneToMany(mappedBy = "plano", fetch = FetchType.LAZY)
    private List<Matricula> matriculas = new ArrayList<>();

    public Plano() {}

    public Long getIdPlano() { return idPlano; }
    public void setIdPlano(Long idPlano) { this.idPlano = idPlano; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    public Integer getDuracaoDias() { return duracaoDias; }
    public void setDuracaoDias(Integer duracaoDias) { this.duracaoDias = duracaoDias; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public List<Matricula> getMatriculas() { return matriculas; }
    public void setMatriculas(List<Matricula> matriculas) { this.matriculas = matriculas; }

    @Override
    public int hashCode() { return idPlano != null ? idPlano.hashCode() : 0; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Plano plano = (Plano) o;
        return idPlano != null && idPlano.equals(plano.idPlano);
    }
}
