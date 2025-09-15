"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

type Marcacao = {
  id: string;
  servico: string;
  cliente_id: string | null;
  nome_cliente?: string | null;
  email_cliente?: string | null;
  barbeiro_id: string;
  data: string;
  hora: string;
};

type User = {
  id: string;
  nome: string | null;
  email?: string | null;
};

export default function HistoricoBarbeiro() {
  const [marcacoes, setMarcacoes] = useState<Marcacao[]>([]);
  const [clientes, setClientes] = useState<User[]>([]);
  const [barbeiros, setBarbeiros] = useState<User[]>([]);
  const [filtro, setFiltro] = useState<"hoje" | "minhas" | "todas">("hoje");
  const [barbeiroId, setBarbeiroId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Pega o user logado
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Usuário logado:", user);
      if (!user) return;

      // 2. Busca o barbeiro correspondente ao user_id
      const { data: barbeiroData, error: barbeiroError } = await supabase
        .from("barbeiros")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (barbeiroError || !barbeiroData) {
        console.error("Erro ao buscar barbeiro:", barbeiroError);
        return;
      }
      setBarbeiroId(barbeiroData.id);
      console.log("Barbeiro ID:", barbeiroData.id);

      // 3. Busca todas as marcações
      const { data: marcacoesData, error: marcacoesError } = await supabase
        .from("marcacoes")
        .select("*");

      if (marcacoesError) {
        console.error("Erro ao buscar marcações:", marcacoesError);
      } else {
        setMarcacoes(marcacoesData || []);
        console.log("Marcações:", marcacoesData);
      }

      // 4. Busca clientes da view
      const { data: clientesData, error: clientesError } = await supabase
        .from("clientes_view")
        .select("*");

      if (clientesError) {
        console.error("Erro ao buscar clientes_view:", clientesError);
      } else {
        setClientes(clientesData || []);
        console.log("Clientes da view:", clientesData);
      }

      // 5. Busca barbeiros
      const { data: barbeirosData, error: barbeirosError } = await supabase.from("barbeiros").select("*");
      if (barbeirosError) {
        console.error("Erro ao buscar barbeiros:", barbeirosError);
      } else {
        setBarbeiros(barbeirosData || []);
        console.log("Barbeiros:", barbeirosData);
      }
    };

    fetchData();
  }, []);

  const hojeStr = new Date().toISOString().split("T")[0];

  // Aplica os filtros
  let marcacoesFiltradas = marcacoes.filter((m) => {
    if (filtro === "hoje") return m.data === hojeStr && m.barbeiro_id === barbeiroId;
    if (filtro === "minhas") return m.barbeiro_id === barbeiroId;
    return true;
  });

  // Ordenação
  marcacoesFiltradas = marcacoesFiltradas.sort((a, b) => {
    const dataHoraA = new Date(`${a.data}T${a.hora}`);
    const dataHoraB = new Date(`${b.data}T${b.hora}`);
    return filtro === "minhas"
      ? dataHoraB.getTime() - dataHoraA.getTime()
      : dataHoraA.getTime() - dataHoraB.getTime();
  });

  // Nome do cliente atualizado, garantindo string
  const getClienteNome = (m: Marcacao) => {
    if (m.cliente_id) {
      const cliente = clientes.find((c) => c.id === m.cliente_id);
      if (cliente) {
        console.log("Cliente encontrado para marcação:", m.id, cliente);
        return String(cliente.nome || m.nome_cliente || "Cliente registado");
      } else {
        console.warn("Cliente não encontrado para ID:", m.cliente_id, "na marcação:", m.id);
        return String(m.nome_cliente || "Cliente registado");
      }
    }
    return String(m.nome_cliente || "Cliente registado");
  };

  const getBarbeiroNome = (id: string) => barbeiros.find((b) => b.id === id)?.nome || id;

  // Agrupamento por dia (só no "todas")
  const groupedByDate: Record<string, Marcacao[]> = {};
  if (filtro === "todas") {
    marcacoesFiltradas.forEach((m) => {
      if (!groupedByDate[m.data]) groupedByDate[m.data] = [];
      groupedByDate[m.data].push(m);
    });
  }

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
      ) : filtro === "todas" ? (
        <div className="space-y-8">
          {Object.keys(groupedByDate)
            .sort()
            .map((date) => (
              <div key={date}>
                <h2 className="text-xl font-semibold mb-4">{date}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedByDate[date].map((m) => (
                    <Card key={m.id} className="p-4 shadow-md">
                      <p>
                        <strong>Serviço:</strong> {m.servico}
                      </p>
                      <p>
                        <strong>Cliente:</strong> {getClienteNome(m)}
                      </p>
                      <p>
                        <strong>Barbeiro:</strong> {getBarbeiroNome(m.barbeiro_id)}
                      </p>
                      <p>
                        <strong>Hora:</strong> {m.hora}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marcacoesFiltradas.map((m) => (
            <Card key={m.id} className="p-4 shadow-md">
              <p>
                <strong>Serviço:</strong> {m.servico}
              </p>
              <p>
                <strong>Cliente:</strong> {getClienteNome(m)}
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
  