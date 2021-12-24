FROM postgres
ENV POSTGRES_PASSWORD docker
COPY db/init.sql /docker-entrypoint-initdb.d/
