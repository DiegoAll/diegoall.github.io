# portfolio


- REBASE
- CHERRY PICK

    cd ~/Projects/portfolio
    npm create vite@latest frontend -- --template react
    cd frontend
    npm install
    npm install react-router-dom gh-pages
    npm run dev

    main.jsx
    Es el punto de entrada de toda la aplicación — el equivalente exacto de tu index.js viejo.


Métricas rápidas (años de experiencia, cantidad de proyectos, certificaciones) en formato de números grandes — le da peso visual inmediato sin mucho esfuerzo de contenido.
Proyecto destacado: una card resaltando tu proyecto más fuerte (ej. ThePragmatic.xyz), con más contexto que en la grilla plana de /projects.
Preview del último post del blog: cuando tengas el blog andando, esto le da sensación de "sitio vivo" y da razón para que alguien vuelva a visitarlo.
Botón de descargar CV en PDF — es algo que casi todo visitante de un portafolio espera encontrar, y hoy no lo tienes.
Íconos de tecnologías en vez de solo texto en los badges — más impacto visual con poco esfuerzo (librerías como react-icons ya traen los logos de Go, Python, AWS, etc.).


go: go.mod requires go >= 1.23 (running go 1.22.12; GOTOOLCHAIN=local)

Tu Dockerfile usa golang:1.22-alpine como imagen base, pero go.mod dice go 1.23. Con GOTOOLCHAIN=local (default en imágenes alpine), Go no descarga automáticamente un toolchain más nuevo — simplemente falla.


    docker-compose up --build -d
    docker-compose down




    docker compose exec db psql -U postgres -d portfolio-db


### Deployment

    terraform init

    terraform plan  -var="ssh_pub_key_path=~/.ssh/gcp/gcp_portfolio_backend.pub"
    terraform apply -var="ssh_pub_key_path=~/.ssh/gcp/gcp_portfolio_backend.pub"