// /pages/api/admin/createBarber.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, nome, password, foto } = req.body;

  if (!email || !nome || !password) {
    return res.status(400).json({ error: "Campos obrigatórios: email, nome, password" });
  }

  console.log("📝 Criando barbeiro com dados:", { email, nome, password, foto });

  try {
    // Criar usuário no Auth
    const { data, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "barber", full_name: nome, foto },
    });

    if (authError) {
      console.error("❌ Erro ao criar usuário no Auth:", authError);
      if (authError.message.includes("already exists")) {
        return res.status(400).json({ error: "Email já registrado no Auth" });
      }
      return res.status(500).json({ error: authError.message || "Falha ao criar usuário" });
    }

    const userId = data.user?.id;
    if (!userId) {
      console.error("❌ Usuário criado sem ID no Auth:", data);
      return res.status(500).json({ error: "Usuário criado sem ID no Auth" });
    }

    console.log("✅ Usuário criado no Auth com ID:", userId);

    // Inserir na tabela barbeiros com user_id = id do Auth
    const { error: dbError } = await supabaseAdmin
      .from("barbeiros")
      .insert([{ user_id: userId, nome, foto }]);

    if (dbError) {
      console.error("❌ Erro ao inserir barbeiro na tabela:", dbError);
      // Rollback: deletar usuário criado no Auth
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return res.status(500).json({ error: dbError.message });
    }

    console.log("✅ Barbeiro inserido na tabela barbeiros com user_id =", userId);

    return res.status(200).json({ message: "Barbeiro criado com sucesso", userId });
  } catch (err) {
    console.error("❌ Erro inesperado ao criar barbeiro:", err);
    return res.status(500).json({ error: "Erro inesperado ao criar barbeiro" });
  }
}
