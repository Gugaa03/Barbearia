import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { nome, email, password, fotoFile } = req.body;

  if (!nome || !email || !password) {
    return res.status(400).json({ error: "Campos obrigatórios: nome, email, password" });
  }

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "barber", full_name: nome },
    });

    if (authError) return res.status(500).json({ error: authError.message });

    const userId = authData.user?.id;
    if (!userId) return res.status(500).json({ error: "Usuário criado sem ID no Auth" });

    let fotoUrl = "";

    if (fotoFile) {
      const buffer = Buffer.from(fotoFile, "base64"); 
      const filename = `file-${Date.now()}.jpg`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("barbeiros")
        .upload(filename, buffer, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return res.status(500).json({ error: "Erro ao enviar foto: " + uploadError.message });
      }

      const { data: urlData } = supabaseAdmin.storage.from("barbeiros").getPublicUrl(filename);
      fotoUrl = urlData.publicUrl;
    }

    const { error: dbError } = await supabaseAdmin
      .from("barbeiros")
      .insert([{ user_id: userId, nome, foto: fotoUrl }]);

    if (dbError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return res.status(500).json({ error: dbError.message });
    }

    return res.status(200).json({ message: "Barbeiro criado com sucesso", userId, fotoUrl });
  } catch (err: any) {
    console.error("Erro inesperado:", err);
    return res.status(500).json({ error: "Erro inesperado ao criar barbeiro" });
  }
}
