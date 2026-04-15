package util;

import service.UsuarioService;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class AppInitializer implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        UsuarioService usuarioService = new UsuarioService();
        usuarioService.criarUsuarioPadrao();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {}
}
