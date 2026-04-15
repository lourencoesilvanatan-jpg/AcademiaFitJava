package model;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class NivelTreinoConverter implements AttributeConverter<NivelTreino, String> {

    @Override
    public String convertToDatabaseColumn(NivelTreino attribute) {
        if (attribute == null) return null;
        return attribute.getDescricao();
    }

    @Override
    public NivelTreino convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) return null;
        for (NivelTreino n : NivelTreino.values()) {
            if (n.getDescricao().equalsIgnoreCase(dbData) || n.name().equalsIgnoreCase(dbData)) {
                return n;
            }
        }
        return null;
    }
}
