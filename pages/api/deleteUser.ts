import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

/**
 * @swagger
 * /api/deleteUser:
 *   post:
 *     summary: Deleta um usuário pelo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário deletado
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId é obrigatório" });

  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (err: any) {
    console.error("Erro ao deletar usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
