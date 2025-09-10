// /pages/api/appointments/[barberId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { barberId } = req.query;

  if (!barberId) {
    return res.status(400).json({ error: "barberId é obrigatório" });
  }

  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("appointment_date, service, client_id")
      .eq("barber_id", barberId)
      .order("appointment_date", { ascending: true });

    if (error) {
      console.error("Erro ao buscar agendamentos:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ appointments: data });
  } catch (err: any) {
    console.error("Erro interno ao buscar agendamentos:", err);
    return res.status(500).json({ error: "Erro interno ao buscar agendamentos" });
  }
}
/**
 * @swagger
 * /api/appointments/{barberId}:
 *   get:
 *     summary: Buscar agendamentos de um barbeiro
 *     description: Retorna todos os agendamentos de um barbeiro específico, com datas e serviços.
 *     tags:
 *       - Appointments
 *     parameters:
 *       - name: barberId
 *         in: path
 *         required: true
 *         description: UUID do barbeiro
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de agendamentos do barbeiro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       appointment_date:
 *                         type: string
 *                         format: date-time
 *                       service:
 *                         type: string
 *                       client_id:
 *                         type: string
 *       400:
 *         description: Erro de requisição (parâmetro inválido ou erro do Supabase)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
