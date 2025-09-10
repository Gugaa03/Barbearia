import { useState } from "react";
import { Calendar } from "../components/ui/calendar"; // shadcn calendar
import { Button } from "../components/ui/button";

const servicos = [
  { id: 1, nome: "Corte de Cabelo", preco: "15€" },
  { id: 2, nome: "Barba", preco: "10€" },
  { id: 3, nome: "Corte + Barba", preco: "22€" },
];

const barbeiros = [
  {
    id: 1,
    nome: "João Silva",
    foto: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    nome: "Carlos Santos",
    foto: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 3,
    nome: "Rui Pereira",
    foto: "https://randomuser.me/api/portraits/men/12.jpg",
  },
];

const horarios = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function Marcacoes() {
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(
    null
  );
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState<number | null>(
    null
  );
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(
    undefined
  );
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null);

  const handleConfirmar = () => {
    if (
      !servicoSelecionado ||
      !barbeiroSelecionado ||
      !dataSelecionada ||
      !horaSelecionada
    ) {
      alert("Por favor preencha todos os campos!");
      return;
    }

    const servico = servicos.find((s) => s.id === servicoSelecionado)?.nome;
    const barbeiro = barbeiros.find((b) => b.id === barbeiroSelecionado)?.nome;

    alert(
      `✅ Marcação confirmada!\n\nServiço: ${servico}\nBarbeiro: ${barbeiro}\nData: ${dataSelecionada.toLocaleDateString()}\nHora: ${horaSelecionada}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Marcar Consulta</h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Serviço */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Escolha o serviço</h2>
          <select
            value={servicoSelecionado ?? ""}
            onChange={(e) => setServicoSelecionado(Number(e.target.value))}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Selecione um serviço</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>
                {servico.nome} - {servico.preco}
              </option>
            ))}
          </select>
        </div>

        {/* Barbeiros */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Escolha o barbeiro</h2>
          <div className="grid grid-cols-2 gap-6">
            {barbeiros.map((barbeiro) => (
              <div
                key={barbeiro.id}
                onClick={() => setBarbeiroSelecionado(barbeiro.id)}
                className={`cursor-pointer border rounded-xl p-4 text-center transition hover:shadow-lg ${
                  barbeiroSelecionado === barbeiro.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={barbeiro.foto}
                  alt={barbeiro.nome}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <p className="font-medium">{barbeiro.nome}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendário e horários */}
      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Escolha a data</h2>
          <Calendar
            mode="single"
            selected={dataSelecionada}
            onSelect={setDataSelecionada}
            className="rounded-md border"
          />
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Escolha o horário</h2>
          <div className="grid grid-cols-3 gap-4">
            {horarios.map((hora) => (
              <button
                key={hora}
                onClick={() => setHoraSelecionada(hora)}
                className={`px-4 py-2 rounded-lg border transition ${
                  horaSelecionada === hora
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {hora}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmar */}
      <div className="text-center mt-10">
        <Button
          onClick={handleConfirmar}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
        >
          Confirmar Marcação
        </Button>
      </div>
    </div>
  );
}
