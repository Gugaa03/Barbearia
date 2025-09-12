import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { userId, role, barbeiroId } = req.body;

  if (!userId || !role) return res.status(400).json({ error: "userId e role são obrigatórios" });

  const normalizedRole = role.trim().toLowerCase();
  if (!["cliente", "barber"].includes(normalizedRole))
    return res.status(400).json({ error: "Role inválida. Use 'cliente' ou 'barber'" });

  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role: normalizedRole },
    });
    if (error) return res.status(500).json({ error: error.message });

    // Associar barbeiro se for barber
    if (normalizedRole === "barber" && barbeiroId) {
      const { error: assocError } = await supabaseAdmin
        .from("barbeiros")
        .update({ user_id: userId })
        .eq("id", barbeiroId);

      if (assocError) return res.status(500).json({ error: assocError.message });
    }

    return res.status(200).json({ user: data });
  } catch (err) {
    console.error("Erro inesperado:", err);
    return res.status(500).json({ error: "Erro inesperado ao atualizar role" });
  }
}
