package util;

import service.UsuarioService;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebListener
public class AppInitializer implements ServletContextListener {

    private static final Logger LOG = Logger.getLogger(AppInitializer.class.getName());

    private ScheduledExecutorService scheduler;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            UsuarioService usuarioService = new UsuarioService();
            usuarioService.criarUsuarioPadrao();
            LOG.info("AcademiaFit: inicializacao concluida.");
        } catch (Exception e) {
            LOG.log(Level.SEVERE,
                    "AcademiaFit: falha ao inicializar (banco indisponivel?). "
                  + "O contexto subiu mesmo assim - corrija a conexao com o MySQL e reinicie.",
                    e);
        }

        iniciarJobExpiracao();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        if (scheduler != null) {
            scheduler.shutdownNow();
        }
    }

    private void iniciarJobExpiracao() {
        scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "matricula-expiration-job");
            t.setDaemon(true);
            return t;
        });
        scheduler.scheduleAtFixedRate(
                new MatriculaExpirationJob(),
                30,
                TimeUnit.DAYS.toSeconds(1),
                TimeUnit.SECONDS
        );
        LOG.info("Job de expiracao de matriculas agendado (intervalo: 24h, primeira execucao em 30s).");
    }
}
