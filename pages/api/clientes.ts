import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os usuários do Auth
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) return res.status(400).json({ error: error.message });

    const users = data.map(user => ({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata.full_name,
      role: user.user_metadata.role,
    }));

    res.status(200).json(users);
  } catch (err: any) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
