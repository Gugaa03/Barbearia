"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Barbeiro = {
  id: string;
  nome: string;
  role?: string;
  foto?: string;
};

export default function EditarBarbeiroPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [barbeiro, setBarbeiro] = useState<Barbeiro | null>(null);
  const [nome, setNome] = useState("");
  const [role, setRole] = useState("barber");
  const [foto, setFoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchBarbeiro = async () => {
      if (!id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("barbeiros")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar barbeiro:", error);
        setLoading(false);
        return;
      }

      if (!data) {
        console.warn("Nenhum barbeiro encontrado para esse id");
        setBarbeiro(null);
        setLoading(false);
        return;
      }

      setBarbeiro(data);
      setNome(data.nome ?? "");
      setRole(data.role ?? "barber");
      setFoto(data.foto ?? "");
      setLoading(false);
    };

    fetchBarbeiro();
  }, [id]);

  const handleUploadFoto = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        alert("Por favor selecione uma imagem para upload.");
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}.${fileExt}`;
      const filePath = `barbeiros/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("barbeiros")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // gera URL pública
      const { data } = supabase.storage
        .from("barbeiros")
        .getPublicUrl(filePath);
      setFoto(data.publicUrl);

      alert("✅ Foto carregada com sucesso!");
    } catch (error: any) {
      console.error(error);
      alert("❌ Erro ao carregar foto: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!barbeiro) return;

    setSaving(true);
    const { error } = await supabase
      .from("barbeiros")
      .update({ nome, foto })
      .eq("id", barbeiro.id);

    if (error) {
      alert("❌ Erro ao salvar barbeiro: " + error.message);
    } else {
      alert("✅ Barbeiro atualizado com sucesso!");
      router.push("/admin/barbeiros");
    }
    setSaving(false);
  };

  if (loading)
    return <p className="text-center mt-12">Carregando barbeiro...</p>;
  if (!barbeiro)
    return <p className="text-center mt-12">Barbeiro não encontrado.</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-6">
      <div className="w-full max-w-lg p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Editar Barbeiro</h1>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Nome</span>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Foto do Barbeiro</span>
          <input
            type="text"
            value={foto}
            onChange={(e) => setFoto(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-3"
            placeholder="Ou cole a URL manualmente"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleUploadFoto}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
            "
          />

          {foto && (
            <img
              src={foto}
              alt={nome}
              className="w-24 h-24 rounded-full mt-3 object-cover"
            />
          )}
        </label>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}
