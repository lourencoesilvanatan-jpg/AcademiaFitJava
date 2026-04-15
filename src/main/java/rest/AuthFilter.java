package rest;

import util.JwtUtil;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class AuthFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext ctx) throws IOException {
        String path = ctx.getUriInfo().getPath();

        // Rotas públicas
        if (path.startsWith("auth/")) {
            return;
        }

        // OPTIONS (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(ctx.getMethod())) {
            return;
        }

        String authHeader = ctx.getHeaderString("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            ctx.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"erro\":\"Token nao fornecido\"}")
                    .build());
            return;
        }

        String token = authHeader.substring(7);
        if (!JwtUtil.isTokenValido(token)) {
            ctx.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"erro\":\"Token invalido ou expirado\"}")
                    .build());
        }
    }
}
