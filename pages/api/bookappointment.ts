import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { client_id, barber_id, service, appointment_date } = req.body;

  if (!client_id || !barber_id || !service || !appointment_date) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .insert([{ client_id, barber_id, service, appointment_date }]);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Agendamento criado com sucesso", appointment: data });
  } catch (err: any) {
    console.error("Erro ao criar agendamento:", err);
    return res.status(500).json({ error: "Erro interno ao criar agendamento" });
  }
}
