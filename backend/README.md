# backend


    docker-compose --env-file .env up --build -d


    docker-compose up --build

    docker-compose down -v --rmi all
    docker-compose up --build -d
    docker-compose up --build -d CACHE
    docker compose up -d --build api

    docker-compose ps
    docker-compose logs -f api
    docker-compose logs -f web
    docker-compose ps
    docker exec -it bold-db psql -U postgres -d secure-coding-db

    docker-compose up -d --no-build api
    docker-compose exec api env | grep GOOGLE
    docker exec bold-web env | grep RECAPTCHA
    docker exec bold-web env
    



    npx create-react-app go-movies-front-end
    npm install
    npm start (Permite el hot reload)
    npm run build (prod)


        docker exec -i bold-db psql -U postgres -d secure-coding-db \
  < migration_003_normalize_model.sql


    docker exec -i bold-db psql -U postgres -d secure-coding-db \
    < migration_002_training.sql


    docker exec -i bold-db psql -U postgres -d secure-coding-db \
    < sql/migration_002_user_roles.sql