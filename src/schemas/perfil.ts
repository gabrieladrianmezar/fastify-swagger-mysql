export const perfilSchema = {
  $id: "perfilSchema",
  type: "object",
  properties: {
    id_perfil: { type: "number" },
    descripcion: { type: "string" },
  },
  required: ["id_perfil", "descripcion"],
} as const;
