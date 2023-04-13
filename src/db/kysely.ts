import { Kysely, MysqlDialect } from "kysely";
import { DB } from "kysely-codegen";
import mysql from "mysql2/promise";

const db = new Kysely<DB>({
  dialect: new MysqlDialect({
    pool: mysql.createPool({
      host: "10.0.53.250",
      port: 3306,
      user: "root",
      password: "syss1st3m4s",
      database: "gestionsigo",
    }),
  }),
});

const rows = await db.selectFrom("").selectAll().execute();
