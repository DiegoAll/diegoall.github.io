# Dockerfile de desarrollo — corre el dev server de Vite dentro del contenedor.
# Para un build de producción real (servir estático desde Nginx en vez de
# esto) se necesita un Dockerfile distinto con "npm run build" + nginx; este
# es el que corresponde a Docker-compose.yaml tal como está ahora (servicio
# "web" apuntando a :5173).
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host 0.0.0.0 es obligatorio: por default Vite solo escucha en localhost
# DENTRO del contenedor, lo que lo hace inalcanzable desde fuera (Nginx no
# podría llegar a web:5173).
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]