// /pages/api/users/roles.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json([]);
    }

    // Filtra apenas quem já confirmou (authenticated)
    const mappedUsers = data.users
      .filter((user) => user.app_metadata?.role === "authenticated")
      .map((user) => ({
        id: user.id,
        email: user.email ?? "",
        full_name: user.user_metadata?.full_name ?? "",
        role: user.user_metadata?.role ?? "cliente", // padrão "cliente"
      }));

    return res.status(200).json(mappedUsers);
  } catch (err: any) {
    console.error("Erro interno:", err);
    return res.status(500).json([]);
  }
}
