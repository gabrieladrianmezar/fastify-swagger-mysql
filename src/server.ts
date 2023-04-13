import { FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import build from "./app";

const loggerConfig = {
  transport: {
    target: "pino-pretty",
    options: {
      levelFirst: true,
      translateTime: true,
      colorize: true,
    },
  },
};

let exposeDocs = true;
if (process.env.NODE_ENV === "production") {
  loggerConfig.transport.options.levelFirst = false;
  loggerConfig.transport.options.translateTime = false;
  loggerConfig.transport.options.colorize = false;
  exposeDocs = true;
}
const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = build({
  logger: loggerConfig,
  exposeDocs,
});

app.listen(8000, "127.0.0.1", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
