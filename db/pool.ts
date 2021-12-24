import pgp from "pg-promise";

const pgLib = pgp({});
const pool = pgLib({
  host: "127.0.0.1",
  user: "postgres",
  password: "docker",
  port: 5432,
});

export default pool;
