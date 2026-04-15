package model;

public enum GrupoMuscular {

    PEITORAL("Peitoral"),
    COSTAS("Costas"),
    OMBROS("Ombros"),
    BICEPS("Biceps"),
    TRICEPS("Triceps"),
    QUADRICEPS("Quadriceps"),
    POSTERIOR("Posterior"),
    GLUTEOS("Gluteos"),
    PANTURRILHA("Panturrilha"),
    ABDOMEN("Abdomen"),
    ANTEBRACO("Antebraco"),
    TRAPEZIO("Trapezio"),
    CORPO_INTEIRO("Corpo Inteiro"),
    CARDIO("Cardio");

    private final String descricao;

    GrupoMuscular(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
