// pages/api/sendConfirmation.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { nomeCliente, emailCliente, servico, barbeiro, data, hora } = req.body;

  if (!emailCliente) return res.status(400).json({ error: "Email do cliente é obrigatório" });

  const { data: emailData, error } = await supabaseAdmin
    .from("mails") // Tabela mágica do Supabase para enviar emails
    .insert([
      {
        to: emailCliente,
        subject: "Confirmação de Marcação",
        html: `
          <h1>Olá ${nomeCliente}!</h1>
          <p>Sua marcação foi confirmada:</p>
          <ul>
            <li>Serviço: ${servico}</li>
            <li>Barbeiro: ${barbeiro}</li>
            <li>Data: ${data}</li>
            <li>Hora: ${hora}</li>
          </ul>
          <p>Obrigado por escolher nossa barbearia!</p>
        `
      }
    ]);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ message: "Email de confirmação enviado!" });
}
