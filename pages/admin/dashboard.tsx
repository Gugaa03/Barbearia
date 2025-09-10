// /pages/admin/dashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // cliente normal (anon)

interface Cliente {
  id: string;
  nome: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar clientes da view
  const fetchClientes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("clientes_view").select("*");
    if (error) {
      console.error("Erro ao buscar clientes:", error.message);
    } else {
      setClientes(data as Cliente[]);
    }
    setLoading(false);
  };

  // Deletar cliente via endpoint seguro
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que quer deletar este cliente?")) return;

    try {
      const res = await fetch("/api/deleteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Erro ao deletar:", data.error);
        alert("Erro ao deletar: " + data.error);
      } else {
        alert("Usuário deletado com sucesso!");
        fetchClientes(); // Atualiza a lista
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      alert("Erro inesperado ao deletar usuário");
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
        <div className="bg-white shadow rounded-lg p-4">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-medium">{cliente.nome}</p>
                <p className="text-sm text-gray-500">{cliente.email}</p>
                <p className="text-xs text-gray-400">Role: {cliente.role}</p>
              </div>
              <button
                onClick={() => handleDeleteUser(cliente.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Deletar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
