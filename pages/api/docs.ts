// /pages/api/docs.ts
import { NextApiRequest, NextApiResponse } from "next";

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "API BarberShop",
    version: "1.0.0",
    description: "API para marcações de clientes e barbeiros",
  },
  servers: [
    { url: "http://localhost:3000/api" }, // muda para o domínio em produção
  ],
  paths: {
    "/marcacoes/create": {
      post: {
        summary: "Criar uma nova marcação",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  clienteId: { type: "string" },
                  barbeiroId: { type: "string" },
                  servico: { type: "string" },
                  data: { type: "string", format: "date" },
                  hora: { type: "string" },
                },
                required: ["clienteId", "barbeiroId", "servico", "data", "hora"],
              },
              example: {
                clienteId: "uuid-do-cliente",
                barbeiroId: "uuid-do-barbeiro",
                servico: "Corte de cabelo",
                data: "2025-09-12",
                hora: "14:00",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Marcação criada",
            content: {
              "application/json": {
                example: {
                  message: "Marcação criada com sucesso",
                  marcacao: {
                    id: "uuid",
                    cliente_id: "uuid-do-cliente",
                    barbeiro_id: "uuid-do-barbeiro",
                    servico: "Corte de cabelo",
                    data: "2025-09-12",
                    hora: "14:00",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/marcacoes/disponiveis": {
      get: {
        summary: "Listar horários disponíveis para um barbeiro numa data",
        parameters: [
          {
            name: "barbeiroId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "data",
            in: "query",
            required: true,
            schema: { type: "string", format: "date" },
          },
        ],
        responses: {
          200: {
            description: "Horários disponíveis",
            content: {
              "application/json": {
                example: {
                  disponiveis: ["09:00", "10:00", "11:00"],
                },
              },
            },
          },
        },
      },
    },
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(swaggerSpec);
}
