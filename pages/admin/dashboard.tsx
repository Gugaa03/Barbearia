"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  LabelList,
} from "recharts";

import { Scissors, User, Calendar, DollarSign } from "lucide-react";

interface User {
  id: string;
  user_id?: string | null;
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

  // Estados separados para dados e carregamento
  const [clientes, setClientes] = useState<User[]>([]);
  const [barbeiros, setBarbeiros] = useState<User[]>([]);
  const [marcacoes, setMarcacoes] = useState<Marcacao[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingBarbeiros, setLoadingBarbeiros] = useState(false);
  const [loadingMarcacoes, setLoadingMarcacoes] = useState(false);

  // Estado aba e filtro
  const [aba, setAba] = useState<"clientes" | "barbeiros" | "custos">("clientes");
  const [filtroTempo, setFiltroTempo] = useState<"diario" | "mensal" | "anual">("diario");

  // ===== LOGOUT AUTOMÁTICO CASO USUÁRIO SEJA DELETADO =====
  useEffect(() => {
    const checkUserDeleted = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Se não existe usuário, redireciona ao login
        router.push("/login");
        return;
      }

      // Verifica se usuário existe no DB ou foi deletado
      const { data: authUser, error } = await supabase.auth.getUser();

      if (error || !authUser) {
        alert("Sua conta foi deletada. Você será deslogado.");
        await supabase.auth.signOut();
        router.push("/login");
      }
    };

    checkUserDeleted();
    const interval = setInterval(checkUserDeleted, 30000);
    return () => clearInterval(interval);
  }, [router]);

  // ===== FUNÇÕES PARA BUSCAR DADOS =====
  const fetchClientes = useCallback(async () => {
    setLoadingClientes(true);
    try {
      const { data, error } = await supabase.from("clientes_view").select("*");
      if (error) throw error;
      setClientes(data ?? []);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    } finally {
      setLoadingClientes(false);
    }
  }, []);

  const fetchBarbeiros = useCallback(async () => {
    setLoadingBarbeiros(true);
    try {
      const { data, error } = await supabase.from("barbeiros").select("*");
      if (error) throw error;
      setBarbeiros(data ?? []);
    } catch (err) {
      console.error("Erro ao buscar barbeiros:", err);
    } finally {
      setLoadingBarbeiros(false);
    }
  }, []);

  const fetchMarcacoes = useCallback(async () => {
    setLoadingMarcacoes(true);
    try {
      const { data, error } = await supabase.from("marcacoes").select("*");
      if (error) throw error;
      setMarcacoes(data ?? []);
    } catch (err) {
      console.error("Erro ao buscar marcações:", err);
    } finally {
      setLoadingMarcacoes(false);
    }
  }, []);

  const fetchAllData = useCallback(() => {
    fetchClientes();
    fetchBarbeiros();
    fetchMarcacoes();
  }, [fetchClientes, fetchBarbeiros, fetchMarcacoes]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ===== DELETAR USUÁRIO =====
  const handleDeleteUser = useCallback(
    async (userIdOrId?: string | null, barbeiroId?: string) => {
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
        else fetchAllData();
      } catch (err) {
        console.error("Erro inesperado ao deletar:", err);
        alert("Erro inesperado ao deletar");
      }
    },
    [fetchAllData]
  );

  // ===== CÁLCULO DE GANHOS =====
  const calcularGanhos = useCallback(() => {
    const today = new Date();

    let filteredMarcacoes: Marcacao[] = [];

    if (filtroTempo === "diario") {
      filteredMarcacoes = marcacoes.filter(
        (m) => new Date(m.data).toDateString() === today.toDateString()
      );
    } else if (filtroTempo === "mensal") {
      filteredMarcacoes = marcacoes.filter(
        (m) =>
          new Date(m.data).getMonth() === today.getMonth() &&
          new Date(m.data).getFullYear() === today.getFullYear()
      );
    } else if (filtroTempo === "anual") {
      filteredMarcacoes = marcacoes.filter(
        (m) => new Date(m.data).getFullYear() === today.getFullYear()
      );
    }

    const total = filteredMarcacoes.reduce((sum, m) => sum + m.preco, 0);

    const chartData = Object.entries(
      filteredMarcacoes.reduce<Record<string, number>>((acc, m) => {
        acc[m.servico] = (acc[m.servico] || 0) + m.preco;
        return acc;
      }, {})
    ).map(([servico, valor]) => ({ servico, valor }));

    return { total, chartData, count: filteredMarcacoes.length };
  }, [marcacoes, filtroTempo]);

  const { total, chartData, count } = calcularGanhos();

  // ===== COMPONENTES AUXILIARES =====
  const Loading = () => <p>Carregando...</p>;

  const EmptyState = ({ message }: { message: string }) => (
    <p className="text-center text-gray-500">{message}</p>
  );

  // Retorna cor baseada no nome do serviço
  const getColorForServico = (servico: string) => {
    const lower = servico.toLowerCase();
    if (lower.includes("barba")) return "#e53e3e";
    if (lower.includes("corte")) return "#38a169";
    if (lower.includes("combo")) return "#d69e2e";
    return "#3182ce";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-700 flex items-center gap-2">
        <Scissors className="w-10 h-10 text-blue-600" /> Dashboard Admin
      </h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        {["clientes", "barbeiros", "custos"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-2xl transition-all duration-300 font-semibold ${
              aba === tab
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-100"
            }`}
            onClick={() => setAba(tab as typeof aba)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* === Clientes === */}
      {aba === "clientes" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
          {loadingClientes ? (
            <Loading />
          ) : clientes.length === 0 ? (
            <EmptyState message="Nenhum cliente encontrado." />
          ) : (
            clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-medium">{cliente.nome ?? "Sem nome"}</p>
                  <p className="text-sm text-gray-500">{cliente.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(cliente.user_id ?? cliente.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-transform transform hover:scale-105"
                >
                  Deletar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* === Barbeiros === */}
      {aba === "barbeiros" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
          {loadingBarbeiros ? (
            <Loading />
          ) : barbeiros.length === 0 ? (
            <EmptyState message="Nenhum barbeiro encontrado." />
          ) : (
            barbeiros.map((barber) => (
              <div
                key={barber.id}
                className="flex justify-between items-center border-b py-3"
              >
                <div className="flex items-center gap-4">
                  {barber.foto && (
                    <img
                      src={barber.foto}
                      alt={barber.nome ?? ""}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <p className="font-medium">{barber.nome ?? "Sem nome"}</p>
                </div>
                <button
                  onClick={() =>
                    handleDeleteUser(barber.user_id ?? barber.id, barber.id)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-transform transform hover:scale-105"
                >
                  Deletar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* === Custos / Receitas === */}
      {aba === "custos" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-8">
          {loadingMarcacoes ? (
            <Loading />
          ) : (
            <>
              {/* Filtro de tempo */}
              <div className="flex justify-center gap-4 mb-6 items-center flex-wrap">
                <label className="font-semibold text-gray-700">
                  Mostrar ganhos:
                </label>
                <select
                  value={filtroTempo}
                  onChange={(e) =>
                    setFiltroTempo(e.target.value as "diario" | "mensal" | "anual")
                  }
                  className="border px-3 py-2 rounded-lg"
                >
                  <option value="diario">Diário</option>
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              {/* Cards de resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
                  <DollarSign className="mx-auto w-10 h-10 text-blue-600 mb-2" />
                  <h3 className="text-lg font-semibold mb-2">Ganhos Totais</h3>
                  <p className="text-2xl font-bold text-blue-700">
                    {total.toFixed(2)} €
                  </p>
                </div>
                <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-green-50 to-green-100">
                  <Calendar className="mx-auto w-10 h-10 text-green-600 mb-2" />
                  <h3 className="text-lg font-semibold mb-2">Nº de Marcações</h3>
                  <p className="text-2xl font-bold text-green-700">{count}</p>
                </div>
                <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-yellow-50 to-yellow-100">
                  <Scissors className="mx-auto w-10 h-10 text-yellow-600 mb-2" />
                  <h3 className="text-lg font-semibold mb-2">Serviço Mais Popular</h3>
                  <p className="text-xl font-bold text-yellow-700">
                    {chartData.length > 0
                      ? chartData.reduce((a, b) => (a.valor > b.valor ? a : b)).servico
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Gráfico */}
             
<div className="mt-8 max-w-4xl mx-auto">
  <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
    Ganhos por Serviço
  </h3>
  <ResponsiveContainer width="100%" height={350}>
    <BarChart
      data={chartData}
      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
      barCategoryGap="20%"
    >
      <XAxis
        dataKey="servico"
        tick={{ fill: "#4a5568", fontWeight: "600" }}
        angle={-30}
        textAnchor="end"
        interval={0}
        height={60}
      />
      <YAxis
        tick={{ fill: "#4a5568", fontWeight: "600" }}
        tickFormatter={(value) => `${value.toFixed(0)}€`}
      />
      <Tooltip
        wrapperStyle={{ borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}
        contentStyle={{ backgroundColor: "#f7fafc", borderRadius: 8 }}
        formatter={(value: number) => [`${value.toFixed(2)} €`, "Ganhos"]}
        labelStyle={{ fontWeight: "bold", color: "#2d3748" }}
      />
      <Bar dataKey="valor" fill="#3182ce" radius={[8, 8, 0, 0]} barSize={50}>
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getColorForServico(entry.servico)} />
        ))}
        <LabelList
          dataKey="valor"
          position="top"
          formatter={(value: number) => `${value.toFixed(2)}€`}
          style={{ fill: "#2d3748", fontWeight: "600" }}
        />
      </Bar>
      <Legend
        verticalAlign="bottom"
        height={36}
        wrapperStyle={{ marginTop: 20 }}
        formatter={(value: string) => (
          <span style={{ color: "#4a5568", fontWeight: "600" }}>{value}</span>
        )}
      />
    </BarChart>
  </ResponsiveContainer>
</div>


              {/* Lista detalhada */}
              <div className="mt-8 overflow-x-auto">
                <h3 className="text-xl font-bold mb-4 text-center">Detalhes</h3>
                <table className="w-full border-collapse border border-gray-200 text-center rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="border p-3">Serviço</th>
                      <th className="border p-3">Ganhos (€)</th>
                      <th className="border p-3">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map(({ servico, valor }, idx) => (
                      <tr
                        key={servico}
                        className={`${
                          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-blue-50 transition`}
                      >
                        <td className="border p-3">{servico}</td>
                        <td className="border p-3">{valor.toFixed(2)}</td>
                        <td className="border p-3">
                          {total > 0 ? ((valor / total) * 100).toFixed(1) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
