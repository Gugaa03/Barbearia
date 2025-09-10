import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

/**
 * @swagger
 * /api/cortes:
 *   get:
 *     summary: Lista todos os cortes disponíveis
 *     tags:
 *       - Cortes
 *     responses:
 *       200:
 *         description: Lista de cortes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   duration:
 *                     type: integer
 *                   barber_id:
 *                     type: string
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin.from("cortes").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { name, duration, barberId } = req.body;
    if (!name || !duration || !barberId)
      return res.status(400).json({ error: "Campos obrigatórios" });

    const { data, error } = await supabaseAdmin
      .from("cortes")
      .insert([{ name, duration, barber_id: barberId }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Método não permitido" });
}

/**
 * @swagger
 * /api/cortes:
 *   post:
 *     summary: Cria um novo corte e associa a um barbeiro
 *     tags:
 *       - Cortes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               duration:
 *                 type: integer
 *               barberId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Corte criado com sucesso
 *       400:
 *         description: Campos obrigatórios faltando
 *       500:
 *         description: Erro ao criar corte
 */
