// /pages/api/admin/users.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Busca todos os usuários do Auth
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({ error: "Erro ao buscar usuários" });
    }

    // Filtra apenas os que têm user_metadata.role === "authenticated"
    const filteredUsers = data.users
      .filter((user) => user.user_metadata?.role === "authenticated")
      .map((user) => ({
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role,
        full_name: user.user_metadata?.full_name || "",
      }));

    return res.status(200).json(filteredUsers);
  } catch (err: any) {
    console.error("Erro interno:", err);
    return res.status(500).json({ error: err.message });
  }
}
