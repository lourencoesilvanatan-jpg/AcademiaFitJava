package model;

public enum StatusMatricula {

    ATIVA("Ativa"),
    CANCELADA("Cancelada"),
    EXPIRADA("Expirada");

    private final String descricao;

    StatusMatricula(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
