// /pages/admin/dashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // Cliente normal (anon)

interface Cliente {
  id: string;
  nome: string;
  email: string;
  role: string;
  app_role?: string; // opcional, se vier do Supabase para confirmar
}

export default function AdminDashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar clientes da view
  const fetchClientes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("clientes_view").select("*");
      if (error) {
        console.error("Erro ao buscar clientes:", error.message);
      } else {
        // Filtrar apenas usuários confirmados
        const confirmedUsers = (data as Cliente[]).filter(
          (c) => c.app_role === "authenticated" || c.role // depende do campo disponível
        );
        console.log("Clientes confirmados recebidos:", confirmedUsers);
        setClientes(confirmedUsers);
      }
    } catch (err) {
      console.error("Erro inesperado ao buscar clientes:", err);
    }
    setLoading(false);
  };

  // Deletar cliente via endpoint seguro
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que quer deletar este cliente?")) return;

    try {
      console.log("Tentando deletar usuário:", userId);
      const res = await fetch("/api/admin/deleteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json().catch((err) => {
        console.error("Erro ao parsear JSON:", err);
        return null;
      });

      if (!res.ok) {
        console.error("Erro ao deletar:", data?.error);
        alert("Erro ao deletar: " + data?.error);
      } else {
        alert("Usuário deletado com sucesso!");
        fetchClientes(); // Atualiza lista
      }
    } catch (err) {
      console.error("Erro inesperado ao deletar usuário:", err);
      alert("Erro inesperado ao deletar usuário");
    }
  };

  // Atualizar role de um usuário
  const handleRoleChange = async (userId: string, newRole: string) => {
    console.log("Atualizando role", { userId, newRole });
    if (!newRole) {
      alert("Selecione uma role válida!");
      return;
    }

    try {
      const res = await fetch("/api/admin/updateRole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json().catch((err) => {
        console.error("Erro ao parsear JSON:", err);
        return null;
      });

      if (!res.ok) {
        console.error("Erro ao atualizar role:", data?.error);
        alert("Erro ao atualizar role: " + data?.error);
      } else {
        alert("Role atualizada com sucesso!");
        fetchClientes(); // Atualiza lista
      }
    } catch (err) {
      console.error("Erro inesperado ao atualizar role:", err);
      alert("Erro inesperado ao atualizar role");
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {loading ? (
        <p>Carregando clientes...</p>
      ) : clientes.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-medium">{cliente.nome}</p>
                <p className="text-sm text-gray-500">{cliente.email}</p>
                <p className="text-xs text-gray-400">
                  Role: {cliente.role ?? "não definido"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={cliente.role ?? ""}
                  onChange={(e) => handleRoleChange(cliente.id, e.target.value)}
                  className="border px-2 py-1 rounded text-sm"
                >
                  <option value="">Selecionar role</option>
                  <option value="cliente">Cliente</option>
                  <option value="barber">Barbeiro</option>
                </select>
                <button
                  onClick={() => handleDeleteUser(cliente.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
