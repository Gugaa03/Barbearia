import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase"; // seu client admin

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("[REGISTER] Request recebida");

  if (req.method !== "POST") {
    console.log("[REGISTER] Método inválido:", req.method);
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { full_name, email, password } = req.body;
  console.log("[REGISTER] Dados recebidos:", { full_name, email, password: password ? "***" : null });

  if (!full_name || !email || !password) {
    console.log("[REGISTER] Campos obrigatórios faltando");
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    // Criação do usuário no Supabase Auth
    console.log("[REGISTER] Tentando criar usuário no Auth...");
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name, role: "cliente" },
    });

    if (error) {
      console.log("[REGISTER] Erro ao criar usuário:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("[REGISTER] Usuário criado com sucesso:", data);

    res.status(200).json({ message: "Usuário criado com sucesso! Verifique o email para confirmar." });
  } catch (err: any) {
    console.log("[REGISTER] Erro interno:", err);
    res.status(500).json({ error: "Erro interno do servidor: " + err.message });
  }
}
