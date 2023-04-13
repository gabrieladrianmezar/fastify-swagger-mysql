export const usuarioSchema = {
  $id: "usuarioSchema",
  type: "object",
  properties: {
    id: { type: "string" },
    nombre: { type: "string" },
    apellido: { type: "string" },
  },
  required: ["id", "nombre"],
} as const;
