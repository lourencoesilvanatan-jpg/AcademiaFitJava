package util;

import service.MatriculaService;

import java.util.logging.Level;
import java.util.logging.Logger;

public class MatriculaExpirationJob implements Runnable {

    private static final Logger LOG = Logger.getLogger(MatriculaExpirationJob.class.getName());

    @Override
    public void run() {
        try {
            MatriculaService service = new MatriculaService();
            int atualizadas = service.marcarExpiradas();
            if (atualizadas > 0) {
                LOG.info("Job de expiracao: " + atualizadas + " matricula(s) marcada(s) como EXPIRADA.");
            }
        } catch (Exception e) {
            LOG.log(Level.WARNING, "Job de expiracao: erro ao processar matriculas vencidas.", e);
        }
    }
}
