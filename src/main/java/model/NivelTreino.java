package model;

public enum NivelTreino {

    INICIANTE("Iniciante"),
    INTERMEDIARIO("Intermediario"),
    AVANCADO("Avancado");

    private final String descricao;

    NivelTreino(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
