import knex from "knex";

const config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
} as const;

const globalForKnex = globalThis as unknown as {
  knex: ReturnType<typeof knex> | undefined;
};

const db = globalForKnex.knex ?? knex(config);

if (process.env.NODE_ENV !== "production") globalForKnex.knex = db;

export default db;
