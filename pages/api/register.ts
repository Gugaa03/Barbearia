import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Cria um usuário no Supabase Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário criado
 *       400:
 *         description: Erro de requisição
 *       500:
 *         description: Erro interno
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { email, password, full_name, role } = req.body;
  if (!email || !password || !full_name || !role) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // para confirmar via link depois
      user_metadata: { full_name, role },
    });

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Usuário criado com sucesso", user: data });
  } catch (err: any) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
