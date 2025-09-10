import { NextApiRequest, NextApiResponse } from "next";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { createServer } from "http";
import next from "next";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Barbearia API",
      version: "1.0.0",
      description: "API para gerenciamento de clientes e usuários",
    },
  },
  apis: ["./pages/api/*.ts"], // arquivos com rotas
};

const swaggerSpec = swaggerJsdoc(options);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(swaggerSpec);
}
