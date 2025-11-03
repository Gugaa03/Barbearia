"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { Calendar, Clock, Scissors, User, TrendingUp, DollarSign, Users, CheckCircle, XCircle } from "lucide-react";

interface Marcacao {
  id: string;
  servico: string;
  data: string;
  hora: string;
  preco: number;
  status?: string;
  barbeiro_id?: string;
  nome_cliente?: string;
}

interface Stats {
  totalMarcacoes: number;
  totalReceita: number;
  proximasMarcacoes: number;
  marcacoesHoje: number;
}

export default function Dashboard() {
  const [marcacoes, setMarcacoes] = useState<Marcacao[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalMarcacoes: 0,
    totalReceita: 0,
    proximasMarcacoes: 0,
    marcacoesHoje: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      // Buscar marcações do usuário
      const { data: marcacoesData, error } = await supabase
        .from("marcacoes")
        .select("*")
        .eq("cliente_id", user.id)
        .order("data", { ascending: false })
        .order("hora", { ascending: false });

      if (!error && marcacoesData) {
        setMarcacoes(marcacoesData);

        // Calcular estatísticas
        const hoje = new Date().toISOString().split("T")[0];
        const agora = new Date();

        const totalMarcacoes = marcacoesData.length;
        const totalReceita = marcacoesData.reduce((sum, m) => sum + (m.preco || 0), 0);
        const marcacoesHoje = marcacoesData.filter(m => m.data === hoje).length;
        const proximasMarcacoes = marcacoesData.filter(m => {
          const marcacaoDate = new Date(`${m.data}T${m.hora}`);
          return marcacaoDate > agora;
        }).length;

        setStats({
          totalMarcacoes,
          totalReceita,
          proximasMarcacoes,
          marcacoesHoje,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">Você precisa estar logado para acessar o dashboard.</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
          >
            Fazer Login
          </a>
        </motion.div>
      </div>
    );
  }

  const statCards = [
    {
      icon: Calendar,
      label: "Total de Marcações",
      value: stats.totalMarcacoes,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: DollarSign,
      label: "Total Investido",
      value: `${stats.totalReceita}€`,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: TrendingUp,
      label: "Próximas Marcações",
      value: stats.proximasMarcacoes,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Clock,
      label: "Marcações Hoje",
      value: stats.marcacoesHoje,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Meu Dashboard
              </h1>
              <p className="text-gray-600">Bem-vindo de volta, {user.user_metadata?.nome || user.email}!</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${stat.bgColor} rounded-3xl p-6 shadow-lg border border-white/50`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Marcações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-blue-600" />
              Minhas Marcações
            </h2>
            <a
              href="/marcacoes"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg text-sm"
            >
              + Nova Marcação
            </a>
          </div>

          {marcacoes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-4">Você ainda não tem marcações</p>
              <a
                href="/marcacoes"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
              >
                Fazer primeira marcação
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {marcacoes.slice(0, 10).map((marcacao, idx) => {
                const marcacaoDate = new Date(`${marcacao.data}T${marcacao.hora}`);
                const isPast = marcacaoDate < new Date();
                
                return (
                  <motion.div
                    key={marcacao.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      isPast 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md ${
                          isPast ? 'bg-gray-300' : 'bg-gradient-to-br from-blue-600 to-purple-600'
                        }`}>
                          <Scissors className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{marcacao.servico}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(marcacao.data).toLocaleDateString('pt-PT', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {marcacao.hora}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{marcacao.preco}€</p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            {isPast ? (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <CheckCircle className="w-4 h-4" />
                                Concluído
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-green-600">
                                <Clock className="w-4 h-4" />
                                Agendado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
