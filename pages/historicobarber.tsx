"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar, Scissors, User, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: barbeiroData } = await supabase
        .from("barbeiros")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!barbeiroData) return;
      setBarbeiroId(barbeiroData.id);

      const { data: marcacoesData } = await supabase.from("marcacoes").select("*");
      setMarcacoes(marcacoesData || []);

      const { data: clientesData } = await supabase.from("clientes_view").select("*");
      setClientes(clientesData || []);

      const { data: barbeirosData } = await supabase.from("barbeiros").select("*");
      setBarbeiros(barbeirosData || []);
    };

    fetchData();
  }, []);

  const hojeStr = new Date().toISOString().split("T")[0];

  // --- FILTROS ---
  let marcacoesFiltradas = marcacoes.filter((m) => {
    if (filtro === "hoje") return m.data === hojeStr && m.barbeiro_id === barbeiroId;
    if (filtro === "minhas") return m.barbeiro_id === barbeiroId;
    return true;
  });

  // --- ORDENAR SEMPRE DO MAIS RECENTE PARA O MAIS ANTIGO ---
  marcacoesFiltradas = marcacoesFiltradas.sort((a, b) => {
    const dataHoraA = new Date(`${a.data}T${a.hora}`);
    const dataHoraB = new Date(`${b.data}T${b.hora}`);
    return dataHoraB.getTime() - dataHoraA.getTime();
  });

  // --- HELPERS ---
  const getClienteNome = (m: Marcacao) => {
    if (m.cliente_id) {
      const cliente = clientes.find((c) => c.id === m.cliente_id);
      return cliente?.nome || m.nome_cliente || "Cliente registado";
    }
    return m.nome_cliente || "Cliente registado";
  };

  const getBarbeiroNome = (id: string) => barbeiros.find((b) => b.id === id)?.nome || id;

  // --- AGRUPAR POR DATA ---
  const groupedByDate: Record<string, Marcacao[]> = {};
  if (filtro === "todas") {
    marcacoesFiltradas.forEach((m) => {
      if (!groupedByDate[m.data]) groupedByDate[m.data] = [];
      groupedByDate[m.data].push(m);
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-6">
      {/* Cabeçalho */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-10 text-center text-blue-700 flex items-center justify-center gap-2"
      >
        <Calendar className="w-8 h-8" /> Histórico de Marcações
      </motion.h1>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-4 mb-10 flex-wrap"
      >
        {(["hoje", "minhas", "todas"] as const).map((tipo) => (
          <Button
            key={tipo}
            onClick={() => setFiltro(tipo)}
            className={`rounded-full px-6 py-2 shadow-md transition ${
              filtro === tipo
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-100"
            }`}
          >
            {tipo === "hoje"
              ? "Hoje"
              : tipo === "minhas"
              ? "Minhas Marcações"
              : "Todas"}
          </Button>
        ))}
      </motion.div>

      {/* Lista */}
      {marcacoesFiltradas.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 italic text-lg"
        >
          {filtro === "hoje"
            ? "📭 Não tens marcações hoje."
            : filtro === "minhas"
            ? "📭 Não tens marcações atribuídas a ti."
            : "📭 Não há marcações registradas."}
        </motion.p>
      ) : filtro === "todas" ? (
        <div className="space-y-10">
          {Object.keys(groupedByDate)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // MAIS RECENTE PRIMEIRO
            .map((date, index) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
                    <Calendar className="w-6 h-6" /> {date}
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full shadow-sm">
                    {groupedByDate[date].length} marcações
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedByDate[date].map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="p-6 shadow-lg rounded-2xl bg-white hover:shadow-xl transition">
                        <p className="flex items-center gap-2 mb-1">
                          <Scissors className="w-4 h-4 text-blue-500" />
                          <strong>Serviço:</strong> {m.servico}
                        </p>
                        <p className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-green-500" />
                          <strong>Cliente:</strong> {getClienteNome(m)}
                        </p>
                        <p className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-purple-500" />
                          <strong>Barbeiro:</strong> {getBarbeiroNome(m.barbeiro_id)}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <strong>Hora:</strong> {m.hora}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marcacoesFiltradas.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 shadow-lg rounded-2xl bg-white hover:shadow-xl transition">
                <p className="flex items-center gap-2 mb-1">
                  <Scissors className="w-4 h-4 text-blue-500" />
                  <strong>Serviço:</strong> {m.servico}
                </p>
                <p className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-green-500" />
                  <strong>Cliente:</strong> {getClienteNome(m)}
                </p>
                <p className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-purple-500" />
                  <strong>Barbeiro:</strong> {getBarbeiroNome(m.barbeiro_id)}
                </p>
                <p className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <strong>Data:</strong> {m.data}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <strong>Hora:</strong> {m.hora}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
