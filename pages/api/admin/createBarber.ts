import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, nome, foto, password } = req.body;
  if (!email || !nome || !password) {
    return res.status(400).json({ error: "Campos obrigatórios: email, nome, password" });
  }

  try {
    // Criar usuário no Auth
    const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { role: "barber", full_name: nome, foto },
    });

    if (authError || !user) {
      console.error("Erro ao criar usuário:", authError);
      return res.status(500).json({ error: authError?.message });
    }

    // Criar entrada na tabela barbeiros
    const { error: dbError } = await supabaseAdmin
      .from("barbeiros")
      .insert([{ user_id: user.id, nome, foto }]);

    if (dbError) {
      console.error("Erro ao inserir barbeiro na tabela:", dbError);
      return res.status(500).json({ error: dbError.message });
    }

    res.status(200).json({ message: "Barbeiro criado com sucesso", user });
  } catch (err) {
    console.error("Erro inesperado:", err);
    res.status(500).json({ error: "Erro inesperado ao criar barbeiro" });
  }
}
