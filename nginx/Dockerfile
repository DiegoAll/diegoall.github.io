FROM nginx:alpine

# Copiamos la configuración de producción con soporte HTTPS.
COPY default.conf.prod /etc/nginx/conf.d/default.conf
COPY proxy_params.conf /etc/nginx/proxy_params.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]

# ── Nota sobre dev vs prod ──────────────────────────────────────────────────
# Mismo patrón que el proyecto de Bold: se mantienen dos archivos de config
# (default.conf para desarrollo local, default.conf.prod para producción)
# y se elige cuál copiar en el Dockerfile según el entorno de build.