// /pages/api/admin/deleteUser.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { userId, id, email, barbeiroId } = req.body;
console.log("📌 BODY RECEBIDO:", req.body);
let authUserId = req.body.userId || req.body.id;
console.log("🔹 authUserId inicial:", authUserId);
console.log("🔹 barbeiroId:", req.body.barbeiroId);
  try {
    console.log("📌 DELETE REQUEST RECEIVED:", { userId, id, email, barbeiroId });

   // ===== DELETAR BARBEIRO =====
    if (barbeiroId) {
      const { data: barberData, error: barberError } = await supabaseAdmin
        .from("barbeiros")
        .select("user_id")
        .eq("id", barbeiroId)
        .single();

      if (barberError) return res.status(400).json({ error: barberError.message });
      if (!barberData?.user_id) return res.status(400).json({ error: "Barbeiro não possui user_id" });

      const authUserId = barberData.user_id;

      // Verificar se o barbeiro tem marcações
      const { data: marcacoesExistem } = await supabaseAdmin
        .from("marcacoes")
        .select("id")
        .eq("barbeiro_id", barbeiroId)
        .limit(1);

      if (marcacoesExistem?.length) {
        return res.status(400).json({ error: "Não é possível deletar barbeiro com marcações" });
      }

      // Deletar da tabela barbeiros
      const { error: deleteTableError } = await supabaseAdmin
        .from("barbeiros")
        .delete()
        .eq("id", barbeiroId);
      if (deleteTableError) return res.status(400).json({ error: deleteTableError.message });

      // Deletar do Auth
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(authUserId);
      if (deleteAuthError) return res.status(400).json({ error: deleteAuthError.message });

      return res.status(200).json({ success: true, message: "Barbeiro deletado da tabela e do Auth" });
    }
    // ===== DELETAR CLIENTE =====
    let authUserId = userId || id;

    if (!authUserId && email) {
      console.log(`🔍 Procurando cliente na tabela clientes_view com email: ${email}`);

      const { data: clienteData, error: clienteError } = await supabaseAdmin
        .from("clientes_view")
        .select("user_id")
        .eq("email", email)
        .single();

      if (clienteError) {
        console.error("❌ Erro ao buscar cliente na clientes_view:", clienteError);
        return res.status(400).json({ error: clienteError.message });
      }

      if (!clienteData) {
        console.warn("⚠️ Cliente não encontrado com esse email");
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      console.log("✅ Cliente encontrado:", clienteData);

      if (!clienteData.user_id) {
        console.warn("⚠️ Cliente não possui user_id");
        return res.status(400).json({ error: "Cliente não possui user_id" });
      }

      authUserId = clienteData.user_id;
    }

    if (!authUserId) {
      console.warn("⚠️ Nenhum ID encontrado para deletar");
      return res.status(400).json({ error: "ID do Auth ou barbeiroId obrigatório" });
    }

    console.log("🗑️ Deletando usuário do Auth com ID:", authUserId);

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(authUserId);
    if (deleteAuthError) {
      console.error("❌ Erro ao deletar do Auth:", deleteAuthError);
      return res.status(400).json({ error: deleteAuthError.message });
    }

    console.log("✅ Cliente deletado com sucesso do Auth:", authUserId);
    return res.status(200).json({ success: true, message: "Cliente deletado do Auth" });
  } catch (err: any) {
    console.error("❌ Erro inesperado ao deletar usuário/barbeiro:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
}
