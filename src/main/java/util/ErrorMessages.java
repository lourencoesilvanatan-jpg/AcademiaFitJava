package util;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

public class ErrorMessages {

    private ErrorMessages() {}

    public static String extract(Throwable t) {
        Throwable atual = t;
        while (atual != null) {
            if (atual instanceof ConstraintViolationException) {
                ConstraintViolationException cve = (ConstraintViolationException) atual;
                StringBuilder sb = new StringBuilder();
                for (ConstraintViolation<?> v : cve.getConstraintViolations()) {
                    if (sb.length() > 0) sb.append("; ");
                    sb.append(v.getMessage());
                }
                if (sb.length() > 0) return sb.toString();
            }
            Throwable causa = atual.getCause();
            if (causa == null || causa == atual) break;
            atual = causa;
        }
        return t.getMessage() != null ? t.getMessage() : "Erro inesperado";
    }
}
