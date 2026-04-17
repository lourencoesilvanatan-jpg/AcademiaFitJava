package util;

import service.UsuarioService;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebListener
public class AppInitializer implements ServletContextListener {

    private static final Logger LOG = Logger.getLogger(AppInitializer.class.getName());

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
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {}
}
