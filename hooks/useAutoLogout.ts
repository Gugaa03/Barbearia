"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export function useAutoLogout() {
  const router = useRouter();

  useEffect(() => {
    const checkUserDeleted = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Erro ao pegar sessão:", sessionError);
          return;
        }

        if (!session) return; // Não logado

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          // Usuário não existe mais → deletado
          if (userError.message.includes("User from sub claim in JWT does not exist")) {
            alert("Sua conta foi deletada. Você será deslogado.");
            await supabase.auth.signOut();
            router.push("/login");
            return;
          }
          console.error("Erro ao buscar usuário:", userError);
        }

        if (!user) {
          await supabase.auth.signOut();
          router.push("/login");
        }

      } catch (err) {
        console.error("Erro inesperado ao verificar usuário:", err);
      }
    };

    checkUserDeleted();
    const interval = setInterval(checkUserDeleted, 30000); // checa a cada 30s

    return () => clearInterval(interval);
  }, [router]);
}
