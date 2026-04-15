package model;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class GrupoMuscularConverter implements AttributeConverter<GrupoMuscular, String> {

    @Override
    public String convertToDatabaseColumn(GrupoMuscular attribute) {
        if (attribute == null) return null;
        return attribute.getDescricao();
    }

    @Override
    public GrupoMuscular convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) return null;
        for (GrupoMuscular g : GrupoMuscular.values()) {
            if (g.getDescricao().equalsIgnoreCase(dbData) || g.name().equalsIgnoreCase(dbData)) {
                return g;
            }
        }
        return null;
    }
}
