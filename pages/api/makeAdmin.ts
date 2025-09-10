import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { userId, role } = req.body;
  if (!userId || !role) {
    return res.status(400).json({ error: "userId e role são obrigatórios" });
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: { role },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ message: `Role atualizada para ${role}`, data });
}
