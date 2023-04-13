import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import autoload from "@fastify/autoload";
import path from "path";
import fastifySwagger from "@fastify/swagger";
import { usuarioSchema } from "./schemas/usuario";
import { perfilSchema } from "./schemas/perfil";
import { errorSchema } from "./schemas/error";
import fastifySwaggerUi from "@fastify/swagger-ui";

interface buildOpts extends FastifyServerOptions {
  exposeDocs?: boolean;
}

const build = (opts: buildOpts = {}): FastifyInstance => {
  const app = fastify(opts);

  if (opts.exposeDocs) {
    app.register(fastifySwagger, {
      swagger: {
        info: {
          title: "Fastify + Swagger Ejemplo",
          description: "Aquí se encuentra la documentación de las API",
          version: "0.0.1",
        },
        externalDocs: {
          url: "https://swagger.io",
          description: "Encuentra más info aquí",
        },
        host: "127.0.0.1:8000",
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        // tags: [
        //   { name: "user", description: "User related end-points" },
        //   { name: "code", description: "Code related end-points" },
        // ],
        // definitions: {
        //   example: {
        //     type: "object",
        //     required: ["id", "email"],
        //     properties: {
        //       id: { type: "string", format: "uuid" },
        //       firstName: { type: "string" },
        //       secondName: { type: "string" },
        //       email: { type: "string", format: "email" },
        //     },
        //   },
        // },
        securityDefinitions: {
          // apiKey: {
          //   type: "apiKey",
          //   name: "apiKey",
          //   in: "header",
          // },
        },
      },
    });

    app.register(fastifySwaggerUi, {
      routePrefix: "/",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    });
  }

  // app.put(
  //   "/usuario/:usuarioId",
  //   {
  //     schema: {
  //       description: "post some data",
  //       tags: ["user", "code"],
  //       summary: "qwerty",
  //       security: [{ apiKey: [] }],
  //       params: { $ref: "user#" },
  //       body: {
  //         type: "object",
  //         properties: {
  //           hello: { type: "string" },
  //           obj: { $ref: "some#" },
  //         },
  //       },
  //       response: {
  //         201: {
  //           description: "Succesful response",
  //           type: "object",
  //           properties: {
  //             hello: { type: "string" },
  //           },
  //         },
  //         default: {
  //           description: "Default response",
  //           type: "object",
  //           properties: {
  //             foo: { type: "string" },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   (req, reply) => {
  //     reply.send({ hello: `Hello ${req.body.hello}` });
  //   }
  // );

  // add in common schemas
  app.addSchema(usuarioSchema);
  app.addSchema(perfilSchema);
  app.addSchema(errorSchema);

  app.register(autoload, {
    dir: path.join(__dirname, "routes"),
  });
  return app;
};

export default build;
