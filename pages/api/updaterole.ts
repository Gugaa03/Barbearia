// /pages/api/updateRole.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Crie o cliente admin com a service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ error: "userId e role são obrigatórios" });
  }

  try {
    // Atualiza o user_metadata do usuário
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role },
    });

    if (error) {
      console.error("Erro ao atualizar role:", error);
      return res.status(500).json({ error: "Erro ao atualizar role: " + error.message });
    }

    res.status(200).json({ message: "Role atualizada com sucesso!", user: data });
  } catch (err: any) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: "Erro interno do servidor: " + err.message });
  }
}
