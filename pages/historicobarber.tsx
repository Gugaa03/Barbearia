// pages/historico-barbeiro.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

type Marcacao = {
  id: string;
  servico: string;
  cliente_id: string;
  barbeiro_id: string;
  data: string;
  hora: string;
};

type User = {
  id: string;
  nome: string | null;
};

export default function HistoricoBarbeiro() {
  const [marcacoes, setMarcacoes] = useState<Marcacao[]>([]);
  const [clientes, setClientes] = useState<User[]>([]);
  const [barbeiros, setBarbeiros] = useState<User[]>([]);
  const [filtro, setFiltro] = useState<"hoje" | "minhas" | "todas">("hoje");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Buscar todas as marcações
      const { data: marcacoesData, error: marcacoesError } = await supabase
        .from("marcacoes")
        .select("*")
        .order("data", { ascending: true })
        .order("hora", { ascending: true });

      if (marcacoesError) console.error("Erro ao buscar marcações:", marcacoesError);
      else setMarcacoes(marcacoesData || []);

      // Buscar clientes
      const { data: clientesData } = await supabase.from("clientes").select("*");
      setClientes(clientesData || []);

      // Buscar barbeiros
      const { data: barbeirosData } = await supabase.from("barbeiros").select("*");
      setBarbeiros(barbeirosData || []);
    };

    fetchData();
  }, []);

  const hojeStr = new Date().toISOString().split("T")[0];

  const marcacoesFiltradas = marcacoes.filter((m) => {
    if (filtro === "hoje") return m.data === hojeStr && m.barbeiro_id === userId;
    if (filtro === "minhas") return m.barbeiro_id === userId;
    return true;
  });

  const getClienteNome = (id: string) => clientes.find((c) => c.id === id)?.nome || id;
  const getBarbeiroNome = (id: string) => barbeiros.find((b) => b.id === id)?.nome || id;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">📅 Histórico de Marcações</h1>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <Button
          onClick={() => setFiltro("hoje")}
          className={filtro === "hoje" ? "bg-blue-600 text-white" : ""}
        >
          Hoje
        </Button>
        <Button
          onClick={() => setFiltro("minhas")}
          className={filtro === "minhas" ? "bg-blue-600 text-white" : ""}
        >
          Minhas Marcações
        </Button>
        <Button
          onClick={() => setFiltro("todas")}
          className={filtro === "todas" ? "bg-blue-600 text-white" : ""}
        >
          Todas
        </Button>
      </div>

      {marcacoesFiltradas.length === 0 ? (
        <p className="text-center text-gray-500">
          {filtro === "hoje"
            ? "Não tens marcações hoje."
            : filtro === "minhas"
            ? "Não tens marcações atribuídas a ti."
            : "Não há marcações registradas."}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marcacoesFiltradas.map((m) => (
            <Card key={m.id} className="p-4 shadow-md">
              <p>
                <strong>Serviço:</strong> {m.servico}
              </p>
              <p>
                <strong>Cliente:</strong> {getClienteNome(m.cliente_id)}
              </p>
              <p>
                <strong>Barbeiro:</strong> {getBarbeiroNome(m.barbeiro_id)}
              </p>
              <p>
                <strong>Data:</strong> {m.data}
              </p>
              <p>
                <strong>Hora:</strong> {m.hora}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
