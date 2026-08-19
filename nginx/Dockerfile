FROM nginx:alpine

# Qué archivo de config copiar se decide con el build arg NGINX_CONF:
#   - Local (default): default.conf       → HTTP plano, sin certs, para dev
#   - Producción (VM): default.conf.prod  → HTTPS con certs de Let's Encrypt
# El valor real se pasa desde docker-compose.yaml, leyendo la variable de
# entorno NGINX_CONF — que solo está seteada en el .env de la VM, no en el
# .env local, así que localmente siempre cae en el default de dev.
ARG NGINX_CONF=default.conf
COPY ${NGINX_CONF} /etc/nginx/conf.d/default.conf
COPY proxy_params.conf /etc/nginx/proxy_params.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]