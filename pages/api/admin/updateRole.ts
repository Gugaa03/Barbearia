// /pages/api/admin/updateRole.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("=== Request recebida ===");
  console.log("Método:", req.method);
  console.log("Body:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { userId, role } = req.body;

  console.log("userId:", userId);
  console.log("role original:", role);

  if (!userId || !role) {
    return res.status(400).json({ error: "userId e role são obrigatórios" });
  }

  // Normalizar entrada (remove espaços e baixa para minúsculas)
  const normalized = String(role).trim().toLowerCase();
  console.log("role normalizada:", normalized);

  // Mapear várias formas para os dois cargos válidos
  let normalizedRole: "cliente" | "barber" | null = null;

  if (["cliente", "client"].includes(normalized)) {
    normalizedRole = "cliente";
  } else if (["barber", "barbeiro", "barbeiros"].includes(normalized)) {
    normalizedRole = "barber";
  }

  console.log("role final após map:", normalizedRole);

  if (!normalizedRole) {
    console.error("Role inválida detectada");
    return res.status(400).json({ error: "Role inválida. Use 'cliente' ou 'barber'" });
  }

  try {
    // Buscar usuário no Supabase Admin
    const { data: userData, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(userId);
    console.log("Usuário buscado:", userData);

    if (fetchError || !userData) {
      console.error("Erro ao buscar usuário:", fetchError);
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Verificar se usuário confirmou o email
    const isConfirmed = !!userData.user?.email_confirmed_at;
    if (!isConfirmed) {
      console.error("Usuário não confirmado");
      return res.status(403).json({ error: "Usuário não confirmado" });
    }

    // Atualizar role no user_metadata
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { ...userData.user.user_metadata, role: normalizedRole },
    });

    if (error) {
      console.error("Erro ao atualizar role:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("Role atualizada com sucesso:", data);
    return res.status(200).json({ user: data });
  } catch (err) {
    console.error("Erro inesperado:", err);
    return res.status(500).json({ error: "Erro inesperado ao atualizar role" });
  }
}
