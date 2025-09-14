"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
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

  // Pegar usuário logado
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Buscar barbeiros
  useEffect(() => {
    const fetchBarbeiros = async () => {
      const { data, error } = await supabase.from("barbeiros").select("*");
      if (error) return console.error("Erro ao buscar barbeiros:", error);
      setBarbeiros(data || []);
    };
    fetchBarbeiros();
  }, []);

  // Buscar horários ocupados
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

  // Confirmar marcação
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

    const servicoObj = servicos.find(s => s.id === servicoSelecionado);
    if (!servicoObj) return;

    const precoNumerico = Number(servicoObj.preco.replace("€","").trim());

    const payload: any = {
      servico: servicoObj.nome,
      servico_id: servicoSelecionado,
      preco: precoNumerico,
      barbeiro_id: barbeiroSelecionado,
      data: dataSelecionada.toISOString().split("T")[0],
      hora: horaSelecionada
    };

    if (user) {
      payload.cliente_id = user.id;
    } else {
      payload.nome_cliente = nomeCliente;
      payload.email_cliente = emailCliente;
    }

    try {
      const res = await fetch("/api/marcacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("Resposta API:", data);

      if (!res.ok) throw new Error(data.error || "Erro desconhecido");

      alert("✅ Marcação confirmada! Você receberá um email de confirmação.");
      setHoraSelecionada(null);
      setHorariosOcupados([...horariosOcupados, horaSelecionada]);
      setPasso(1);
    } catch (err: any) {
      console.error(err);
      alert("❌ Erro ao criar marcação: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Marcar Consulta</h1>

      {/* Passo 1: Escolher serviço */}
      {passo === 1 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Escolha o serviço</h2>
          {servicos.map(s => (
            <div key={s.id} onClick={() => setServicoSelecionado(s.id)}
              className={`cursor-pointer p-3 mb-3 border rounded-lg ${servicoSelecionado === s.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}>
              {s.nome} - {s.preco}
            </div>
          ))}
          <button onClick={() => setPasso(2)} className="px-6 py-3 rounded-lg bg-blue-600 text-white">Próximo</button>
        </div>
      )}

      {/* Passo 2: Escolher barbeiro */}
      {passo === 2 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Escolha o barbeiro</h2>
          {barbeiros.map(b => (
            <div key={b.id} onClick={() => setBarbeiroSelecionado(b.id)}
              className={`cursor-pointer p-3 mb-3 border rounded-lg ${barbeiroSelecionado === b.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}>
              {b.nome}
            </div>
          ))}
          <div className="flex justify-between">
            <button onClick={() => setPasso(1)} className="px-4 py-2 rounded-lg border">Voltar</button>
            <button onClick={() => setPasso(3)} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Próximo</button>
          </div>
        </div>
      )}

      {/* Passo 3: Escolher data */}
      {passo === 3 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Escolha a data</h2>
          <Calendar onChange={(date: any) => setDataSelecionada(date)} value={dataSelecionada} minDate={new Date()} className="rounded-lg"/>
          <div className="flex justify-between mt-4">
            <button onClick={() => setPasso(2)} className="px-4 py-2 rounded-lg border">Voltar</button>
            <button onClick={() => setPasso(4)} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Próximo</button>
          </div>
        </div>
      )}

      {/* Passo 4: Escolher horário */}
      {passo === 4 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Escolha o horário</h2>
          <div className="grid grid-cols-3 gap-3">
            {horarios.map(h => (
              <button key={h} onClick={() => setHoraSelecionada(h)} disabled={horariosOcupados.includes(h)}
                className={`p-3 rounded-lg border ${horaSelecionada === h ? "bg-blue-600 text-white border-blue-600" : horariosOcupados.includes(h) ? "bg-gray-300 cursor-not-allowed" : "hover:bg-blue-50"}`}>
                {h}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => setPasso(3)} className="px-4 py-2 rounded-lg border">Voltar</button>
            <button onClick={() => setPasso(user ? 6 : 5)} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Próximo</button>
          </div>
        </div>
      )}

      {/* Passo 5: Dados do cliente (não logado) */}
      {passo === 5 && !user && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Seus dados</h2>
          <input type="text" placeholder="Nome completo" value={nomeCliente}
            onChange={e => setNomeCliente(e.target.value)}
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input type="email" placeholder="Email" value={emailCliente}
            onChange={e => setEmailCliente(e.target.value)}
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <div className="flex justify-between">
            <button onClick={() => setPasso(4)} className="px-4 py-2 rounded-lg border">Voltar</button>
            <button onClick={() => setPasso(6)} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Próximo</button>
          </div>
        </div>
      )}

      {/* Passo 6: Confirmar */}
      {passo === 6 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-6">Confirmar Marcação</h2>
          <p className="mb-2">Serviço: <strong>{servicos.find(s => s.id === servicoSelecionado)?.nome}</strong></p>
          <p className="mb-2">Barbeiro: <strong>{barbeiros.find(b => b.id === barbeiroSelecionado)?.nome}</strong></p>
          <p className="mb-2">Data: <strong>{dataSelecionada.toLocaleDateString()}</strong></p>
          <p className="mb-4">Hora: <strong>{horaSelecionada}</strong></p>
          {!user && (
            <>
              <p className="mb-2">Nome: <strong>{nomeCliente}</strong></p>
              <p className="mb-4">Email: <strong>{emailCliente}</strong></p>
            </>
          )}
          <div className="flex justify-between">
            <button onClick={() => setPasso(user ? 4 : 5)} className="px-4 py-2 rounded-lg border">Voltar</button>
            <button onClick={handleConfirmar} className="px-4 py-2 rounded-lg bg-green-600 text-white">Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}
