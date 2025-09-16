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
  Cell,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-700 flex items-center gap-2">
        <Scissors className="w-10 h-10 text-blue-600" /> Dashboard Admin
      </h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          className={`px-6 py-2 rounded-2xl transition-all duration-300 font-semibold ${aba === "clientes" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-100"}`}
          onClick={() => setAba("clientes")}
        >
          Clientes
        </button>
        <button
          className={`px-6 py-2 rounded-2xl transition-all duration-300 font-semibold ${aba === "barbeiros" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-100"}`}
          onClick={() => setAba("barbeiros")}
        >
          Barbeiros
        </button>
        <button
          className={`px-6 py-2 rounded-2xl transition-all duration-300 font-semibold ${aba === "custos" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-100"}`}
          onClick={() => setAba("custos")}
        >
          Custos / Receitas
        </button>
      </div>

      {/* === Clientes === */}
      {aba === "clientes" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
          {loadingClientes ? <p>Carregando clientes...</p> :
            clientes.length === 0 ? <p>Nenhum cliente encontrado.</p> :
              clientes.map(cliente => (
                <div key={cliente.id} className="flex justify-between items-center border-b py-3">
                  <div>
                    <p className="font-medium">{cliente.nome || "Sem nome"}</p>
                    <p className="text-sm text-gray-500">{cliente.email}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(cliente.user_id ?? cliente.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-transform transform hover:scale-105"
                  >
                    Deletar
                  </button>
                </div>
              ))}
        </div>
      )}

      {/* === Barbeiros === */}
      {aba === "barbeiros" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
          {loadingBarbeiros ? <p>Carregando barbeiros...</p> :
            barbeiros.length === 0 ? <p>Nenhum barbeiro encontrado.</p> :
              barbeiros.map(barber => (
                <div key={barber.id} className="flex justify-between items-center border-b py-3">
                  <div className="flex items-center gap-4">
                    {barber.foto && <img src={barber.foto} alt={barber.nome || ""} className="w-12 h-12 rounded-full object-cover" />}
                    <p className="font-medium">{barber.nome || "Sem nome"}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(barber.user_id ?? barber.id, barber.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-transform transform hover:scale-105"
                  >
                    Deletar
                  </button>
                </div>
              ))}
        </div>
      )}

      {/* === Custos / Receitas === */}
      {aba === "custos" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-8">
          {loadingMarcacoes ? <p>Carregando ganhos...</p> : (
            <>
              {/* Filtro de tempo */}
              <div className="flex justify-center gap-4 mb-6 items-center flex-wrap">
                <label className="font-semibold text-gray-700">Mostrar ganhos:</label>
                <select
                  value={filtroTempo}
                  onChange={e => setFiltroTempo(e.target.value as any)}
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
                  <p className="text-2xl font-bold text-blue-700">{total.toFixed(2)} €</p>
                </div>
                <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-green-50 to-green-100">
                  <Calendar className="mx-auto w-10 h-10 text-green-600 mb-2" />
                  <h3 className="text-lg font-semibold mb-2">Nº de Marcações</h3>
                  <p className="text-2xl font-bold text-green-700">{marcacoes.length}</p>
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
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-center">Ganhos por Serviço</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="servico" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ backgroundColor: "white", borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                      formatter={(value: number) => `${value.toFixed(2)} €`}
                    />
                    <Bar dataKey="valor" fill="#3182ce">
                      {chartData.map((entry, index) => {
                        let color = "#3182ce"; // azul padrão
                        if (entry.servico.toLowerCase().includes("barba")) color = "#e53e3e"; // vermelho
                        if (entry.servico.toLowerCase().includes("corte")) color = "#38a169"; // verde
                        if (entry.servico.toLowerCase().includes("combo")) color = "#d69e2e"; // amarelo
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
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
                      <tr key={servico} className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}>
                        <td className="border p-3">{servico}</td>
                        <td className="border p-3">{valor.toFixed(2)}</td>
                        <td className="border p-3">{((valor / total) * 100).toFixed(1)}%</td>
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
