// /pages/api/marcacoes/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { clienteId, barbeiroId, servico, data, hora } = req.body;

  // Validação básica
  if (!clienteId || !barbeiroId || !servico || !data || !hora) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    // Verificar se o cliente existe e está confirmado
    const { data: cliente, error: clienteError } = await supabaseAdmin.auth.admin.getUserById(clienteId);
    if (clienteError || !cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    if (!cliente.user?.email_confirmed_at) {
      return res.status(403).json({ error: "Cliente não confirmado" });
    }

    // Verificar se o barbeiro existe na tabela `barbeiros`
    const { data: barbeiro, error: barbeiroError } = await supabaseAdmin
      .from("barbeiros")
      .select("*")
      .eq("id", barbeiroId)
      .single();

    if (barbeiroError || !barbeiro) {
      return res.status(404).json({ error: "Barbeiro não encontrado" });
    }

    // Verificar se o horário está disponível
    const { data: horariosOcupados, error: horariosError } = await supabaseAdmin
      .from("marcacoes")
      .select("*")
      .eq("barbeiro_id", barbeiroId)
      .eq("data", data)
      .eq("hora", hora);

    if (horariosError) {
      return res.status(500).json({ error: "Erro ao verificar horários" });
    }
    if (horariosOcupados.length > 0) {
      return res.status(400).json({ error: "Horário já ocupado" });
    }

    // Criar a marcação
    const { data: novaMarcacao, error: createError } = await supabaseAdmin
      .from("marcacoes")
      .insert([
        {
          cliente_id: clienteId,
          barbeiro_id: barbeiroId,
          servico,
          data,
          hora,
        },
      ])
      .select()
      .single();

    if (createError) {
      return res.status(500).json({ error: createError.message });
    }

    return res.status(200).json({ message: "Marcação criada com sucesso", marcacao: novaMarcacao });
  } catch (err: any) {
    console.error("Erro inesperado:", err);
    return res.status(500).json({ error: "Erro inesperado ao criar marcação" });
  }
}
