import { FastifyInstance } from "fastify";
import { AuthenticatedRequest, User } from "../../types/types";
import { FromSchema } from "json-schema-to-ts";
import { usuarioSchema } from "../../schemas/usuario";
import { autenticacionSchema } from "../../schemas/autenticacion";

const getUsuarioParamsSchema = {
  type: "object",
  properties: {
    usuarioId: { type: "string" },
  },
  required: ["usuarioId"],
} as const;

interface getUsuarioRequestInterface extends AuthenticatedRequest {
  Params: FromSchema<typeof getUsuarioParamsSchema>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function routes(fastify: FastifyInstance) {
  const summary = "Pide detalles del usuario";
  fastify.get<getUsuarioRequestInterface>(
    "/:usuarioId",
    {
      schema: {
        params: getUsuarioParamsSchema,
        headers: autenticacionSchema,
        summary,
        description: "Deuelve los detalles del usuario",
        tags: ["usuario/:usuarioId"],
        response: {
          200: usuarioSchema,
          "4xx": { $ref: "errorSchema#" },
        },
      },
    },
    async (request, response) => {
      const { usuarioId } = request.params;
      const usuarioResponse: User = {
        id: usuarioId,
        nombre: "Natalia",
        apellido: "Natalia",
      };

      response.status(200).send(usuarioResponse);
    }
  );
}
