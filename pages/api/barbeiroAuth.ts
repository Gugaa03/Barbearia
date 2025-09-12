// pages/api/barbeirosAuth.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supabaseAdmin = createServerSupabaseClient({ req, res });

    // Lista todos os usuários do Auth (server-side)
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Erro ao listar usuários do Auth:", error);
      return res.status(500).json({ error: error.message });
    }

    // Filtra apenas os barbeiros (role = barber)
    const barbeiros = users.filter(u => u.user_metadata?.role === "barber").map(u => ({
      id: u.id,
      email: u.email,
      nome: u.user_metadata?.nome || "Sem nome",
      foto: u.user_metadata?.foto || null,
    }));

    res.status(200).json(barbeiros);
  } catch (err) {
    console.error("Erro inesperado:", err);
    res.status(500).json({ error: "Erro inesperado ao buscar barbeiros" });
  }
}
