// pages/historico-barbeiro.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

type Marcacao = {
  id: string;
  servico: string;
  cliente_id: string;
  data: string;
  hora: string;
};

export default function HistoricoBarbeiro() {
  const [marcacoesHoje, setMarcacoesHoje] = useState<Marcacao[]>([]);
  const [marcacoesPassadas, setMarcacoesPassadas] = useState<Marcacao[]>([]);
  const [mostrarPassadas, setMostrarPassadas] = useState(false);

  useEffect(() => {
    const fetchMarcacoes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("marcacoes")
        .select("*")
        .eq("barbeiro_id", user.id)
        .order("data", { ascending: true });

      if (error) {
        console.error("Erro ao buscar marcações:", error);
        return;
      }

      const hojeStr = new Date().toISOString().split("T")[0];

      const hoje = data?.filter(m => m.data === hojeStr) || [];
      const passadas = data?.filter(m => m.data < hojeStr) || [];

      setMarcacoesHoje(hoje);
      setMarcacoesPassadas(passadas);
    };

    fetchMarcacoes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">📅 Agenda do Dia</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Marcações de Hoje</h2>
        {marcacoesHoje.length === 0 ? (
          <p>Não tens marcações hoje.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {marcacoesHoje.map((m) => (
              <Card key={m.id} className="p-4">
                <p><strong>Serviço:</strong> {m.servico}</p>
                <p><strong>Cliente:</strong> {m.cliente_id}</p>
                <p><strong>Hora:</strong> {m.hora}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Button onClick={() => setMostrarPassadas(!mostrarPassadas)} className="mb-6">
        {mostrarPassadas ? "Ocultar Passadas" : "Ver Marcações Passadas"}
      </Button>

      {mostrarPassadas && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">🕑 Marcações Passadas</h2>
          {marcacoesPassadas.length === 0 ? (
            <p>Não tens histórico de marcações.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {marcacoesPassadas.map((m) => (
                <Card key={m.id} className="p-4">
                  <p><strong>Serviço:</strong> {m.servico}</p>
                  <p><strong>Cliente:</strong> {m.cliente_id}</p>
                  <p><strong>Data:</strong> {m.data}</p>
                  <p><strong>Hora:</strong> {m.hora}</p>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
