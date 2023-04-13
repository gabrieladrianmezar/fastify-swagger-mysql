import { FastifyInstance } from "fastify";
import { AuthenticatedRequest, Perfil } from "../../types/types";
import { FromSchema } from "json-schema-to-ts";
import { perfilSchema } from "../../schemas/perfil";
import { autenticacionSchema } from "../../schemas/autenticacion";
// import {
//   sql,
//   RawBuilder,
//   Kysely,
//   MysqlDialect,
//   MysqlAdapter,
//   MysqlIntrospector,
//   MysqlQueryCompiler,
//   MysqlStream,
// } from "kysely";
// import { DB } from "kysely-codegen";
import { createPool, RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// const db = new Kysely<DB>({
//   dialect: new MysqlDialect({
//     pool: createPool({
// host: process.env.HOST,
// port:  parseInt(process.env.PORT as string, 10),
// user: process.env.USER,
// password: process.env.USER,
// database: process.env.DATABASE,
// waitForConnections: true,
// connectionLimit: 10,
// idleTimeout: 6000,
// queueLimit: 0,
//     }),
//   }),
// });
const pool = createPool({
  host: process.env.HOST,
  port: parseInt(process.env.PORT as string, 10),
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  idleTimeout: 6000,
  queueLimit: 0,
});

const getPerfilParamsSchema = {
  type: "object",
  properties: {
    perfilId: { type: "string" },
  },
  required: ["perfilId"],
} as const;

interface getPerfilRequestInterface extends AuthenticatedRequest {
  Params: FromSchema<typeof getPerfilParamsSchema>;
}

async function getPerfil(perfilId: number): Promise<Perfil | null> {
  const query = `SELECT id_perfil, descripcion FROM perfiles WHERE id_perfil = ?`;
  const [rows] = await pool.query<RowDataPacket[]>(query, [perfilId]);

  if (rows.length > 0) {
    const perfil: Perfil = {
      id_perfil: rows[0].id_perfil,
      descripcion: rows[0].descripcion,
    };
    return perfil;
  }

  return null;
}

// async function testConnectionKysely() {
//   try {
//     const result = await db.selectFrom("perfiles").select("id_perfil").limit(1).execute();
//     console.log("Kysely query result:", result);
//   } catch (error) {
//     console.error("Kysely query error:", error);
//   }
// }

async function testConnectionMysql2() {
  try {
    const [result] = await pool.execute("SELECT 1");
    console.log("mysql2 query result:", result);
  } catch (error) {
    console.error("mysql2 query error:", error);
  }
}

// testConnectionKysely();
testConnectionMysql2();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function routes(fastify: FastifyInstance) {
  const summary = "Pide detalles del perfil";
  fastify.get<getPerfilRequestInterface>(
    "/:perfilId",
    {
      schema: {
        params: getPerfilParamsSchema,
        headers: autenticacionSchema,
        summary,
        description: "Deuelve los detalles del perfil",
        tags: ["perfil/:perfilId"],
        response: {
          200: perfilSchema,
          "4xx": { $ref: "errorSchema#" },
        },
      },
    },
    async (request, response) => {
      const perfilId = parseInt(request.params.perfilId, 10);

      try {
        console.log("Before executing query");
        const perfil = await getPerfil(perfilId);
        console.log("After executing query");

        if (perfil) {
          response.status(200).send(perfil);
        } else {
          response.status(404).send({ message: "No se encontró un perfil" });
        }
      } catch (error) {
        console.error(error);
        response
          .status(500)
          .send({ message: "Ocurrió un error mientras se traía el perfil" });
      }
    }
  );
}
