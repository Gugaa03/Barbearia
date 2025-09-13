"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface User {
  id: string;
  user_id?: string | null; // id do Auth
  nome: string | null;
  email?: string;
  foto?: string | null;
}

interface Marcacao {
  id: string;
  data: string;
  preco: number;
  servico: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [clientes, setClientes] = useState<User[]>([]);
  const [barbeiros, setBarbeiros] = useState<User[]>([]);
  const [marcacoes, setMarcacoes] = useState<Marcacao[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingBarbeiros, setLoadingBarbeiros] = useState(true);
  const [loadingMarcacoes, setLoadingMarcacoes] = useState(true);
  const [aba, setAba] = useState<"clientes" | "barbeiros" | "custos">("clientes");
  const [filtroTempo, setFiltroTempo] = useState<"diario" | "mensal" | "anual">("diario");

  // ===== LOGOUT AUTOMÁTICO CASO USUÁRIO SEJA DELETADO =====
  useEffect(() => {
    const checkUserDeleted = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      try {
        const { data: authUser, error } = await supabase.auth.getUser();
        if (error || !authUser) {
          alert("Sua conta foi deletada. Você será deslogado.");
          await supabase.auth.signOut();
          router.push("/login");
        }
      } catch (err) {
        console.error("Erro ao verificar usuário deletado:", err);
      }
    };
    checkUserDeleted();
    const interval = setInterval(checkUserDeleted, 30000);
    return () => clearInterval(interval);
  }, [router]);

  // ===== BUSCA DADOS =====
  const fetchUsers = async () => {
    setLoadingClientes(true);
    setLoadingBarbeiros(true);
    setLoadingMarcacoes(true);
    try {
      const { data: clientesData } = await supabase.from("clientes_view").select("*");
      setClientes(clientesData as User[]);
      setLoadingClientes(false);

      const { data: barbeirosData } = await supabase.from("barbeiros").select("*");
      setBarbeiros(barbeirosData as User[]);
      setLoadingBarbeiros(false);

      const { data: marcacoesData } = await supabase.from("marcacoes").select("*");
      setMarcacoes(marcacoesData as Marcacao[]);
      setLoadingMarcacoes(false);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setLoadingClientes(false);
      setLoadingBarbeiros(false);
      setLoadingMarcacoes(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== DELETE CLIENTE / BARBEIRO =====
  const handleDeleteUser = async (userIdOrId?: string | null, barbeiroId?: string) => {
    if (!userIdOrId && !barbeiroId) return alert("ID do Auth ou barbeiroId obrigatório");
    if (!confirm("Tem certeza que quer deletar?")) return;

    try {
      const res = await fetch("/api/admin/deleteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userIdOrId, barbeiroId }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) alert("Erro ao deletar: " + data?.error);
      else fetchUsers();
    } catch (err) {
      console.error("Erro inesperado ao deletar:", err);
      alert("Erro inesperado ao deletar");
    }
  };

  // ===== CÁLCULO DE GANHOS =====
  const today = new Date();
  const calcularGanhos = () => {
    let filteredMarcacoes: Marcacao[] = [];

    if (filtroTempo === "diario")
      filteredMarcacoes = marcacoes.filter(m => new Date(m.data).toDateString() === today.toDateString());
    else if (filtroTempo === "mensal")
      filteredMarcacoes = marcacoes.filter(
        m => new Date(m.data).getMonth() === today.getMonth() &&
             new Date(m.data).getFullYear() === today.getFullYear()
      );
    else
      filteredMarcacoes = marcacoes.filter(m => new Date(m.data).getFullYear() === today.getFullYear());

    const total = filteredMarcacoes.reduce((sum, m) => sum + m.preco, 0);

    const chartData = Object.entries(
      filteredMarcacoes.reduce<Record<string, number>>((acc, m) => {
        acc[m.servico] = (acc[m.servico] || 0) + m.preco;
        return acc;
      }, {})
    ).map(([servico, valor]) => ({ servico, valor }));

    return { total, chartData };
  };

  const { total, chartData } = calcularGanhos();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${aba === "clientes" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setAba("clientes")}
        >
          Clientes
        </button>
        <button
          className={`px-4 py-2 rounded ${aba === "barbeiros" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setAba("barbeiros")}
        >
          Barbeiros
        </button>
        <button
          className={`px-4 py-2 rounded ${aba === "custos" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setAba("custos")}
        >
          Custos / Receitas
        </button>
      </div>

      {/* === Clientes === */}
      {aba === "clientes" && (
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
          {loadingClientes ? <p>Carregando clientes...</p> :
            clientes.length === 0 ? <p>Nenhum cliente encontrado.</p> :
              clientes.map(cliente => (
                <div key={cliente.id} className="flex justify-between items-center border-b py-2">
                  <div>
                    <p className="font-medium">{cliente.nome || "Sem nome"}</p>
                    <p className="text-sm text-gray-500">{cliente.email}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDeleteUser(cliente.user_id ?? cliente.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* === Barbeiros === */}
      {aba === "barbeiros" && (
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
          {loadingBarbeiros ? <p>Carregando barbeiros...</p> :
            barbeiros.length === 0 ? <p>Nenhum barbeiro encontrado.</p> :
              barbeiros.map(barber => (
                <div key={barber.id} className="flex justify-between items-center border-b py-2">
                  <div className="flex items-center gap-4">
                    {barber.foto && <img src={barber.foto} alt={barber.nome || ""} className="w-12 h-12 rounded-full object-cover" />}
                    <p className="font-medium">{barber.nome || "Sem nome"}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDeleteUser(barber.user_id ?? barber.id, barber.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* === Custos / Receitas === */}
      {aba === "custos" && (
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          {loadingMarcacoes ? <p>Carregando ganhos...</p> :
            <>
              <div className="flex justify-center gap-4 mb-6">
                <label className="font-semibold text-gray-700">Mostrar ganhos:</label>
                <select
                  value={filtroTempo}
                  onChange={e => setFiltroTempo(e.target.value as any)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="diario">Diário</option>
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Ganhos {filtroTempo.charAt(0).toUpperCase() + filtroTempo.slice(1)}
                </h3>
                <p className="text-2xl font-bold">{total.toFixed(2)} €</p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-center">Ganhos por Serviço</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="servico" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="valor" fill="#3182ce" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>}
        </div>
      )}
    </div>
  );
}
