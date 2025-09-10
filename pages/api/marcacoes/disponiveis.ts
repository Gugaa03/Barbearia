// /pages/api/marcacoes/disponiveis.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { barbeiroId, data } = req.query;

  if (!barbeiroId || !data) {
    return res.status(400).json({ error: "barbeiroId e data são obrigatórios" });
  }

  try {
    const { data: ocupados, error } = await supabaseAdmin
      .from("marcacoes")
      .select("hora")
      .eq("barbeiro_id", barbeiroId)
      .eq("data", data);

    if (error) {
      console.error("Erro ao buscar horários ocupados:", error.message);
      return res.status(400).json({ error: error.message });
    }

    // exemplo: horários fixos das 9h às 18h
    const horarios = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ];

    const indisponiveis = ocupados?.map((o) => o.hora) || [];
    const disponiveis = horarios.filter((h) => !indisponiveis.includes(h));

    return res.status(200).json({ disponiveis });
  } catch (err) {
    console.error("Erro inesperado:", err);
    return res.status(500).json({ error: "Erro interno ao buscar horários" });
  }
}
