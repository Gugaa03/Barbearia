import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase"; // SDK com service_role

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const {
    servico,
    preco,
    barbeiro_id,
    cliente_id,
    nome_cliente,
    email_cliente,
    data,
    hora,
    servico_id,
  } = req.body;

  if (!servico || !preco || !barbeiro_id || !data || !hora) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const { data: inserted, error } = await supabaseAdmin
      .from("marcacoes")
      .insert([
        {
          servico,
          preco,
          barbeiro_id,
          cliente_id: cliente_id || null,
          nome_cliente: nome_cliente || null,
          email_cliente: email_cliente || null,
          data,
          hora,
          servico_id: servico_id || null,
        },
      ])
      .select();

    if (error) {
      console.error("Erro ao inserir marcação:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, marcacao: inserted[0] });
  } catch (err: any) {
    console.error("Erro inesperado:", err);
    return res.status(500).json({ error: "Erro interno ao criar marcação" });
  }
}
