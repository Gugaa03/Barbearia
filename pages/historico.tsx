import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card } from "../components/ui/card";

type Marcacao = {
  id: string;
  servico: string;
  barbeiro: { nome: string }; // ← receber o objeto do barbeiro
  data: string;
  hora: string;
};

export default function HistoricoCliente() {
  const [marcacoesAtuais, setMarcacoesAtuais] = useState<Marcacao[]>([]);
  const [marcacoesPassadas, setMarcacoesPassadas] = useState<Marcacao[]>([]);

  useEffect(() => {
    const fetchMarcacoes = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Usuário logado:", user);
      if (!user) return;

      const { data, error } = await supabase
        .from("marcacoes")
        .select("id, servico, hora, data, barbeiro:barbeiro_id (nome)")
        .eq("cliente_id", user.id)
        .order("data", { ascending: true });

      console.log("Marcações recebidas do Supabase:", data, error);

      if (error) return;

      const hoje = new Date();
      const atuais =
        data?.filter((m) => new Date(m.data + "T" + m.hora) >= hoje) || [];
      const passadas =
        data?.filter((m) => new Date(m.data + "T" + m.hora) < hoje) || [];

      console.log("Marcações atuais:", atuais);
      console.log("Marcações passadas:", passadas);

      setMarcacoesAtuais(atuais);
      setMarcacoesPassadas(passadas);
    };

    fetchMarcacoes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">📖 Meu Histórico</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">📅 Marcações Futuras</h2>
        {marcacoesAtuais.length === 0 ? (
          <p>Não tens marcações futuras.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {marcacoesAtuais.map((m) => (
              <Card key={m.id} className="p-4">
                <p>
                  <strong>Serviço:</strong> {m.servico}
                </p>
                <p>
                  <strong>Barbeiro:</strong> {m.barbeiro?.nome}
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
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">🕑 Marcações Passadas</h2>
        {marcacoesPassadas.length === 0 ? (
          <p>Não tens histórico de marcações.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {marcacoesPassadas.map((m) => (
              <Card key={m.id} className="p-4">
                <p>
                  <strong>Serviço:</strong> {m.servico}
                </p>
                <p>
                  <strong>Barbeiro:</strong> {m.barbeiro?.nome}
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
      </section>
    </div>
  );
}
