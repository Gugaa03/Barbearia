// pages/marcacoes.tsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Serviços disponíveis
const servicos = [
  { id: 1, nome: "Corte de Cabelo", preco: "15€" },
  { id: 2, nome: "Barba", preco: "10€" },
  { id: 3, nome: "Corte + Barba", preco: "22€" },
];

// Horários disponíveis
const horarios = ["09:00","10:00","11:00","14:00","15:00","16:00","17:00"];

export default function Marcacoes() {
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState<string | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null);
  const [barbeiros, setBarbeiros] = useState<{ id: string; nome: string; foto?: string }[]>([]);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);

  // Buscar barbeiros
  useEffect(() => {
    const fetchBarbeiros = async () => {
      const { data, error } = await supabase.from("barbeiros").select("*");
      if (error) {
        console.error("Erro ao buscar barbeiros:", error);
        return;
      }
      console.log("Barbeiros recebidos:", data);
      setBarbeiros(data || []);
    };
    fetchBarbeiros();
  }, []);

  // Buscar marcações do barbeiro e data
  useEffect(() => {
    const fetchMarcacoes = async () => {
      if (!barbeiroSelecionado || !dataSelecionada) return;
      const { data, error } = await supabase
        .from("marcacoes")
        .select("hora")
        .eq("barbeiro_id", barbeiroSelecionado)
        .eq("data", dataSelecionada.toISOString().slice(0,10));
      if (error) {
        console.error("Erro ao buscar marcações:", error);
        return;
      }
      console.log(`Horários ocupados em ${dataSelecionada.toISOString().slice(0,10)}:`, data);
      setHorariosOcupados(data?.map((m: any) => m.hora) || []);
    };
    fetchMarcacoes();
  }, [barbeiroSelecionado, dataSelecionada]);

  // Criar marcação
  const handleConfirmar = async () => {
    console.log("Iniciando criação de marcação...");
    console.log({ servicoSelecionado, barbeiroSelecionado, dataSelecionada, horaSelecionada });

    if (!servicoSelecionado || !barbeiroSelecionado || !dataSelecionada || !horaSelecionada) {
      alert("⚠️ Preencha todos os campos!");
      console.log("Campos obrigatórios não preenchidos.");
      return;
    }

    if (horariosOcupados.includes(horaSelecionada)) {
      alert("⛔ Esse horário já está ocupado!");
      console.log("Tentativa de marcar horário ocupado:", horaSelecionada);
      return;
    }

    // Obter usuário logado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("❌ Usuário não autenticado!");
      console.error("Erro ao obter usuário:", userError);
      return;
    }
    console.log("Usuário logado:", user);

    const servicoNome = servicos.find(s => s.id === servicoSelecionado)?.nome;
    console.log("Serviço selecionado:", servicoNome);

    // Inserção no Supabase
    const { data, error } = await supabase.from("marcacoes").insert([
      {
        servico: servicoNome,
        barbeiro_id: barbeiroSelecionado,
        cliente_id: user.id,
        data: dataSelecionada.toISOString().slice(0,10),
        hora: horaSelecionada
      }
    ]);

    if (error) {
      console.error("Erro ao criar marcação:", error);
      alert("❌ Erro ao criar marcação.");
    } else {
      console.log("Marcações criadas:", data);
      alert("✅ Marcação confirmada!");
      setHoraSelecionada(null);
      setHorariosOcupados([...horariosOcupados, horaSelecionada]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-center text-gray-800 mb-12"
      >
        Marcar Consulta
      </motion.h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Serviços */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Escolha o serviço</h2>
          <div className="grid gap-4">
            {servicos.map((s) => (
              <div
                key={s.id}
                onClick={() => setServicoSelecionado(s.id)}
                className={`cursor-pointer border rounded-xl p-4 transition hover:shadow-lg ${
                  servicoSelecionado === s.id ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <p className="font-bold text-lg">{s.nome}</p>
                <p className="text-gray-600">{s.preco}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Calendário */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Escolha a data</h2>
          <Calendar
            onChange={(date: any) => setDataSelecionada(date)}
            value={dataSelecionada}
            minDate={new Date()}
            className="w-full border rounded-xl"
          />
        </motion.div>

        {/* Barbeiros */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Escolha o barbeiro</h2>
          <div className="grid grid-cols-2 gap-4">
            {barbeiros.length === 0 ? (
              <p>Nenhum barbeiro disponível</p>
            ) : (
              barbeiros.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setBarbeiroSelecionado(b.id)}
                  className={`cursor-pointer border rounded-xl p-4 text-center transition hover:shadow-lg ${
                    barbeiroSelecionado === b.id ? "border-blue-600 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  {b.foto && (
                    <img src={b.foto} alt={b.nome} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
                  )}
                  <p className="font-medium">{b.nome}</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Horários */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Escolha o horário</h2>
        <div className="grid grid-cols-3 gap-4">
          {horarios.map((hora) => (
            <button
              key={hora}
              onClick={() => setHoraSelecionada(hora)}
              disabled={horariosOcupados.includes(hora)}
              className={`px-4 py-2 rounded-lg border transition ${
                horariosOcupados.includes(hora)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : horaSelecionada === hora
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {hora}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Confirmar */}
      <div className="text-center mt-10">
        <button
          onClick={handleConfirmar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg transition"
        >
          Confirmar Marcação
        </button>
      </div>
    </div>
  );
}
