import dotenv from "dotenv";

type configType = {
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  USER: string;
  PASSWORD: string;
  DATABASE: string;
};

function getConfigFromEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} no está definida`);
  }
  return value;
}

export function getConfig(): configType {
  dotenv.config();

  return {
    NODE_ENV: getConfigFromEnv("NODE_ENV"),
    HOST: getConfigFromEnv("HOST"),
    PORT: parseInt(getConfigFromEnv("PORT")),
    USER: getConfigFromEnv("USER"),
    PASSWORD: getConfigFromEnv("PASSWORD"),
    DATABASE: getConfigFromEnv("DATABASE"),
  };
}
