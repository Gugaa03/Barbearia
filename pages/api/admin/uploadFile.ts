import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  try {
    // Recebe o arquivo puro do frontend (blob)
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const fileName = `file-${Date.now()}.jpg`; // ou envie do frontend
    const { data, error } = await supabaseAdmin.storage
      .from("barbeiros")
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/jpeg",
      });

    if (error) return res.status(500).json({ error: error.message });

    const publicUrl = supabaseAdmin.storage.from("barbeiros").getPublicUrl(data.path).publicUrl;
    return res.status(200).json({ url: publicUrl });
  } catch (err) {
    console.error("Erro inesperado no upload:", err);
    return res.status(500).json({ error: "Erro inesperado ao fazer upload" });
  }
}
