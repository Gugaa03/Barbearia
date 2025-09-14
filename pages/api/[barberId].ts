import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const {
    servico,
    servico_id,
    preco,
    barbeiro_id,
    cliente_id,
    nome_cliente,
    email_cliente,
    data,
    hora
  } = req.body;

  if (!servico || !preco || !barbeiro_id || !data || !hora) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  }

  try {
    const { data: inserted, error } = await supabaseAdmin
      .from("marcacoes")
      .insert([{
        servico,
        servico_id,
        preco,
        barbeiro_id,
        cliente_id: cliente_id || null,
        nome_cliente: nome_cliente || null,
        email_cliente: email_cliente || null,
        data,
        hora
      }])
      .select();

    if (error) throw error;

    return res.status(200).json({ success: true, inserted });
  } catch (err: any) {
    console.error("Erro ao criar marcação:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
