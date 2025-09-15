import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { userId, nome, email } = req.body;
  if (!userId || !nome || !email) return res.status(400).json({ error: "Campos obrigatórios" });

  try {
    const { data, error } = await supabaseAdmin.from("clientes").insert([
      {
        id: userId,
        nome,
        email,
        role: "cliente"
      }
    ]);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Cliente registrado na tabela clientes!" });
  } catch (err: any) {
    console.error("Erro ao inserir cliente:", err);
    return res.status(500).json({ error: err.message });
  }
}
