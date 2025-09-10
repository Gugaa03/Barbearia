// /pages/api/createBarber.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

interface ResponseData {
  barberId?: string;
  message: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email, password, full_name } = req.body;
  if (!email || !password || !full_name) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    // Cria o usuário no Auth
    const { user, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { role: "barber", full_name },
      email_confirm: true, // opcional: já confirma o email
    });

    if (error || !user) {
      return res.status(400).json({ message: "Erro ao criar usuário", error: error?.message });
    }

    return res.status(200).json({
      barberId: user.id,
      message: "Usuário barbeiro criado com sucesso",
    });
  } catch (err: any) {
    console.error("Erro criando barbeiro:", err);
    return res.status(500).json({ message: "Erro interno do servidor", error: err.message });
  }
}
