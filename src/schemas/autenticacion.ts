export const autenticacionSchema = {
  $id: "autenticacionSchema",
  type: "object",
  properties: {
    authorization: { type: "string" },
  },
  // required: ["authorization"],
} as const;
