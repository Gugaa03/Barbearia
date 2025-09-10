// scripts/updateRoles.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kegeragmactgsihcpygt.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZ2VyYWdtYWN0Z3NpaGNweWd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzM3MDEyNSwiZXhwIjoyMDcyOTQ2MTI1fQ.75rIEOEZqTkibL5H8caUzp39yrrWIisW7ZQG06GGLoU";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function updateRoles() {
  try {
    // 1. Buscar todos os usuários
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) throw error;

    console.log(`Total de usuários: ${users.length}`);

    for (const user of users) {
      // Se o usuário não tiver role, define como 'cliente'
      const role = user.user_metadata?.role || "cliente";
      const full_name = user.user_metadata?.full_name || user.email;

      const { user: updatedUser, error: updateError } =
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          user_metadata: { ...user.user_metadata, role, full_name },
        });

      if (updateError) {
        console.error(
          `Erro ao atualizar usuário ${user.email}:`,
          updateError.message
        );
      } else {
        console.log(
          `Usuário ${user.email} atualizado com role: ${role}`
        );
      }
    }

    // 2. Atualizar um usuário específico para 'barber' ou 'admin'
    const specificUserId = "ID_DO_USUARIO"; // troque pelo ID real
    const { user: updated, error: specificError } =
      await supabaseAdmin.auth.admin.updateUserById(specificUserId, {
        user_metadata: { role: "barber", full_name: "Nome do Barbeiro" },
      });

    if (specificError) console.error(specificError.message);
    else console.log(`Usuário ${specificUserId} agora é barber`);
  } catch (err: any) {
    console.error("Erro geral:", err.message);
  }
}

updateRoles();
