"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  nome: string | null;
  email?: string;
  role?: string | null;
  app_role?: string;
  foto?: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [clientes, setClientes] = useState<User[]>([]);
  const [barbeiros, setBarbeiros] = useState<User[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingBarbeiros, setLoadingBarbeiros] = useState(true);
  const [aba, setAba] = useState<"clientes" | "barbeiros">("clientes");

  const fetchUsers = async () => {
    setLoadingClientes(true);
    setLoadingBarbeiros(true);
    try {
      // Buscar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from("clientes_view")
        .select("*");

      if (clientesError) {
        console.error("Erro ao buscar clientes:", clientesError.message);
      } else {
        const clientesUsers = clientesData as User[];
        setClientes(
          clientesUsers.filter(
            (u) => u.app_role === "cliente" || u.role === "cliente"
          )
        );
        console.log("Clientes carregados:", clientesUsers);
      }

      // Buscar barbeiros diretamente da tabela 'barbeiros'
      const { data: barbeirosData, error: barbeirosError } = await supabase
        .from("barbeiros")
        .select("*"); // pega todos os campos, incluindo id UUID

      if (barbeirosError) {
        console.error("Erro ao buscar barbeiros:", barbeirosError.message);
      } else {
        const barbeirosUsers = barbeirosData as User[];
        setBarbeiros(barbeirosUsers);
        console.log("Barbeiros carregados:", barbeirosUsers);
      }
    } catch (err) {
      console.error("Erro inesperado ao buscar users:", err);
    } finally {
      setLoadingClientes(false);
      setLoadingBarbeiros(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!newRole) return;

    try {
      const res = await fetch("/api/admin/updateRole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Erro ao atualizar role:", data?.error);
        alert("Erro ao atualizar role: " + data?.error);
      } else {
        alert("Role atualizada com sucesso!");
        fetchUsers();
      }
    } catch (err) {
      console.error("Erro inesperado ao atualizar role:", err);
      alert("Erro inesperado ao atualizar role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que quer deletar este usuário?")) return;

    try {
      const res = await fetch("/api/admin/deleteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Erro ao deletar:", data?.error);
        alert("Erro ao deletar: " + data?.error);
      } else {
        alert("Usuário deletado com sucesso!");
        fetchUsers();
      }
    } catch (err) {
      console.error("Erro inesperado ao deletar:", err);
      alert("Erro inesperado ao deletar usuário");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {/* Abas */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            aba === "clientes" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setAba("clientes")}
        >
          Clientes
        </button>
        <button
          className={`px-4 py-2 rounded ${
            aba === "barbeiros" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setAba("barbeiros")}
        >
          Barbeiros
        </button>
      </div>

      {/* Clientes */}
      {aba === "clientes" && (
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
          {loadingClientes ? (
            <p>Carregando clientes...</p>
          ) : clientes.length === 0 ? (
            <p>Nenhum cliente encontrado.</p>
          ) : (
            clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p className="font-medium">{cliente.nome || "Sem nome"}</p>
                  <p className="text-sm text-gray-500">{cliente.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={cliente.role ?? ""}
                    onChange={(e) =>
                      handleRoleChange(cliente.id, e.target.value)
                    }
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
            ))
          )}
        </div>
      )}

      {/* Barbeiros */}
      {aba === "barbeiros" && (
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
          {loadingBarbeiros ? (
            <p>Carregando barbeiros...</p>
          ) : barbeiros.length === 0 ? (
            <p>Nenhum barbeiro encontrado.</p>
          ) : (
            barbeiros.map((barber) => (
              <div
                key={barber.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div className="flex items-center gap-4">
                  {barber.foto && (
                    <img
                      src={barber.foto}
                      alt={barber.nome || ""}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{barber.nome || "Sem nome"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={barber.role ?? ""}
                    onChange={(e) =>
                      handleRoleChange(barber.id, e.target.value)
                    }
                    className="border px-2 py-1 rounded text-sm"
                  >
                    <option value="">Selecionar role</option>
                    <option value="cliente">Cliente</option>
                    <option value="barber">Barbeiro</option>
                  </select>
                  <button
                    onClick={() =>
                      router.push(`/admin/edit-barber/${barber.id}`)
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(barber.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
