import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { email } = req.body;
  console.log("🔎 Check user exists para email:", email);

  try {
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error("❌ Erro ao listar usuários:", error);
      // Retorna exists: false mesmo em caso de erro
      return res.status(200).json({ exists: false });
    }

    const exists = users.some(u => u.email === email);
    console.log("📌 Usuário existe?", exists);

    return res.status(200).json({ exists });
  } catch (err: any) {
    console.error("❌ Erro inesperado:", err);
    return res.status(200).json({ exists: false });
  }
}
