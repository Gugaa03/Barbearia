import { supabase } from "../../lib/supabase";

export async function isAdmin() {
  const user = supabase.auth.user();
  if (!user) return false;

  const { data } = await supabase
    .from("clientes")
    .select("role")
    .eq("id", user.id)
    .single();

  return data?.role === "admin";
}

export async function getUserRole() {
  const user = supabase.auth.user();
  if (!user) return null;

  const { data } = await supabase
    .from("clientes")
    .select("role")
    .eq("id", user.id)
    .single();

  return data?.role || null;
}
