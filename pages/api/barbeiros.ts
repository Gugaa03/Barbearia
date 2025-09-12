import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("=== /api/barbeiros request ===");
  console.log("Método:", req.method);

  if (req.method !== "GET") return res.status(405).json({ error: "Método não permitido" });

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    console.log("Resposta supabase listUsers:", data, error);

    if (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json([]);
    }

    const users = data?.users || [];
    console.log("Array users:", users);

    const barbeiros = users
      .filter(u => u.email_confirmed_at && u.user_metadata?.role === "barber")
      .map(u => ({
        id: u.id,
        nome: u.user_metadata?.full_name || "Sem nome",
        foto: u.user_metadata?.foto || "",
      }));

    console.log("Barbeiros filtrados:", barbeiros);

    res.status(200).json(barbeiros);
  } catch (err) {
    console.error("Erro inesperado:", err);
    res.status(500).json([]);
  }
}
