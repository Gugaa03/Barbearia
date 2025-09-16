"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { Scissors, User, Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";

const servicos = [
  { id: 1, nome: "Corte de Cabelo", preco: "15€" },
  { id: 2, nome: "Barba", preco: "10€" },
  { id: 3, nome: "Corte + Barba", preco: "22€" },
];

const horarios = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

export default function Marcacoes() {
  const [passo, setPasso] = useState(1);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState<string | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null);
  const [barbeiros, setBarbeiros] = useState<{ id: string; nome: string; foto?: string }[]>([]);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [user, setUser] = useState<any>(null);

  const BUCKET_URL =
    "https://kegeragmactgsihcpygt.supabase.co/storage/v1/object/public/barbeiros";

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchBarbeiros = async () => {
      const { data, error } = await supabase.from("barbeiros").select("*");
      if (error) return console.error("Erro ao buscar barbeiros:", error);

      const barbeirosComFoto =
        data?.map((b: any) => {
          let fotoURL = "";
          if (b.foto) {
            fotoURL = b.foto.startsWith("http") ? b.foto : `${BUCKET_URL}/${b.foto}`;
          }
          return {
            id: b.id,
            nome: b.nome,
            foto: fotoURL,
          };
        }) || [];

      setBarbeiros(barbeirosComFoto);
    };
    fetchBarbeiros();
  }, []);

  useEffect(() => {
    const fetchMarcacoes = async () => {
      if (!barbeiroSelecionado || !dataSelecionada) return;
      const { data, error } = await supabase
        .from("marcacoes")
        .select("hora")
        .eq("barbeiro_id", barbeiroSelecionado)
        .eq("data", dataSelecionada.toISOString().split("T")[0]);
      if (error) return console.error("Erro ao buscar marcações:", error);
      setHorariosOcupados(data?.map((m: any) => m.hora) || []);
    };
    fetchMarcacoes();
  }, [barbeiroSelecionado, dataSelecionada]);

  const handleConfirmar = async () => {
    if (!servicoSelecionado || !barbeiroSelecionado || !dataSelecionada || !horaSelecionada) {
      return alert("⚠️ Preencha todos os campos!");
    }
    if (!user && (!nomeCliente || !emailCliente)) {
      return alert("⚠️ Preencha seu nome e email!");
    }
    if (horariosOcupados.includes(horaSelecionada)) {
      return alert("⛔ Esse horário já está ocupado!");
    }

    const servicoObj = servicos.find((s) => s.id === servicoSelecionado);
    if (!servicoObj) return;

    const precoNumerico = Number(servicoObj.preco.replace("€", "").trim());

    const payload: any = {
      servico: servicoObj.nome,
      servico_id: servicoSelecionado,
      preco: precoNumerico,
      barbeiro_id: barbeiroSelecionado,
      data: dataSelecionada.toISOString().split("T")[0],
      hora: horaSelecionada,
    };

    if (user) {
      payload.cliente_id = user.id;
      payload.email_cliente = user.email;
      payload.nome_cliente = user.user_metadata?.nome || "Cliente";
    } else {
      payload.nome_cliente = nomeCliente;
      payload.email_cliente = emailCliente;
    }

    try {
      const res = await fetch("/api/marcacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro desconhecido");

      alert("✅ Marcação confirmada! Você receberá um email de confirmação.");
      setHoraSelecionada(null);
      setHorariosOcupados([...horariosOcupados, horaSelecionada!]);
      setPasso(1);
    } catch (err: any) {
      console.error(err);
      alert("❌ Erro ao criar marcação: " + err.message);
    }
  };

  const barbeiroSelecionadoObj = barbeiros.find((b) => b.id === barbeiroSelecionado);

  const disableDomingos = (date: Date) => date.getDay() === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-center mb-10 text-blue-700"
      >
        ✂️ Marcar Consulta
      </motion.h1>

      {/* --- Passos --- */}
      {passo === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Scissors className="w-6 h-6 text-blue-600" /> Escolha o serviço
          </h2>
          <div className="space-y-3 mb-6">
            {servicos.map((s) => (
              <div
                key={s.id}
                onClick={() => setServicoSelecionado(s.id)}
                className={`cursor-pointer p-4 rounded-xl border transition ${
                  servicoSelecionado === s.id
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="font-medium">{s.nome}</span>
                <span className="float-right text-blue-600">{s.preco}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPasso(2)}
            className="w-full px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Próximo
          </button>
        </motion.div>
      )}

      {passo === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" /> Escolha o barbeiro
          </h2>
          <div className="space-y-3 mb-6">
            {barbeiros.map((b) => (
              <div
                key={b.id}
                onClick={() => setBarbeiroSelecionado(b.id)}
                className={`cursor-pointer p-4 flex items-center gap-4 rounded-xl border transition ${
                  barbeiroSelecionado === b.id
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "hover:bg-gray-50"
                }`}
              >
                {b.foto ? (
                  <img
                    src={b.foto}
                    alt={b.nome}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    📷
                  </div>
                )}
                <span className="font-medium">{b.nome}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setPasso(1)}
              className="px-6 py-2 rounded-xl border hover:bg-gray-100 transition"
            >
              Voltar
            </button>
            <button
              onClick={() => {
                if (!barbeiroSelecionado) return alert("⚠️ Escolha um barbeiro primeiro!");
                setPasso(3);
              }}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Próximo
            </button>
          </div>
        </motion.div>
      )}

      {passo === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" /> Escolha a data e horário
          </h2>
          <Calendar
            onChange={(date: any) => setDataSelecionada(date)}
            value={dataSelecionada}
            minDate={new Date()}
            tileDisabled={({ date }) => disableDomingos(date)}
            className="rounded-lg border mb-4"
          />
          <div className="grid grid-cols-3 gap-3 mt-4">
            {horarios.map((h) => (
              <button
                key={h}
                onClick={() => setHoraSelecionada(h)}
                disabled={horariosOcupados.includes(h)}
                className={`p-3 rounded-xl border font-medium transition ${
                  horaSelecionada === h
                    ? "bg-blue-600 text-white border-blue-600"
                    : horariosOcupados.includes(h)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "hover:bg-blue-50"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setPasso(2)}
              className="px-6 py-2 rounded-xl border hover:bg-gray-100 transition"
            >
              Voltar
            </button>
            <button
              onClick={() => setPasso(user ? 6 : 5)}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Próximo
            </button>
          </div>
        </motion.div>
      )}

      {passo === 5 && !user && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-semibold mb-6">Seus dados</h2>
          <input
            type="text"
            placeholder="Nome completo"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            className="w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={emailCliente}
            onChange={(e) => setEmailCliente(e.target.value)}
            className="w-full mb-6 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between">
            <button
              onClick={() => setPasso(3)}
              className="px-6 py-2 rounded-xl border hover:bg-gray-100 transition"
            >
              Voltar
            </button>
            <button
              onClick={() => setPasso(6)}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Próximo
            </button>
          </div>
        </motion.div>
      )}

      {passo === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl text-center"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" /> Confirmar Marcação
          </h2>
          <p className="mb-2">
            <strong>Serviço:</strong>{" "}
            {servicos.find((s) => s.id === servicoSelecionado)?.nome}
          </p>
          <p className="mb-2">
            <strong>Barbeiro:</strong> {barbeiroSelecionadoObj?.nome}
          </p>
          {barbeiroSelecionadoObj?.foto && (
            <img
              src={barbeiroSelecionadoObj.foto}
              alt={barbeiroSelecionadoObj.nome}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
          )}
          <p className="mb-2">
            <strong>Data:</strong> {dataSelecionada.toLocaleDateString()}
          </p>
          <p className="mb-4">
            <strong>Hora:</strong> {horaSelecionada}
          </p>
          {!user && (
            <>
              <p className="mb-2">
                <strong>Nome:</strong> {nomeCliente}
              </p>
              <p className="mb-4">
                <strong>Email:</strong> {emailCliente}
              </p>
            </>
          )}
          <div className="flex justify-between">
            <button
              onClick={() => setPasso(user ? 3 : 5)}
              className="px-6 py-2 rounded-xl border hover:bg-gray-100 transition"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirmar}
              className="px-6 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
