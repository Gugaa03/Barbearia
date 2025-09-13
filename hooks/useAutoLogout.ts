import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAuthLogoutOnDeleted() {
  useEffect(() => {
    const checkUserDeleted = async () => {
      console.log("🔎 Checando se usuário foi deletado...");

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("❌ Erro ao obter sessão:", sessionError);
        return;
      }

      const session = sessionData?.session;
      if (!session?.user) {
        console.log("⚠️ Nenhum usuário logado");
        return;
      }

      const { email } = session.user;
      console.log("👤 Usuário logado:", email);

      try {
        const res = await fetch("/api/checkUserExists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        console.log("📌 Resposta do fetch:", res.status);

        const data = await res.json().catch(() => null);
        console.log("📄 Dados recebidos do endpoint:", data);

        // Se o endpoint falhar ou usuário não existir → logout
        if (!res.ok || !data || data.exists === false) {
          console.log("🚪 Usuário não existe mais, realizando logout:", email);
          await supabase.auth.signOut();
        } else {
          console.log("✅ Usuário ainda existe:", email);
        }

      } catch (err) {
        console.error("❌ Erro ao checar usuário no backend:", err);
      }
    };

    // Checa imediatamente e depois a cada 30s
    checkUserDeleted();
    const interval = setInterval(checkUserDeleted, 30000);

    return () => clearInterval(interval);
  }, []);
}
