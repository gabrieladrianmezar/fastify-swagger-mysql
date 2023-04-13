import { RequestGenericInterface } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { usuarioSchema } from "../schemas/usuario";
import { perfilSchema } from "../schemas/perfil";

export type User = FromSchema<typeof usuarioSchema>;
export type Perfil = FromSchema<typeof perfilSchema>;
export interface AuthenticatedRequest extends RequestGenericInterface {
  Headers: {
    authorization: string;
  };
}
