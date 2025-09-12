// /components/RegisterBarber.tsx
import { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";

export default function RegisterBarber() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [usarUrl, setUsarUrl] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      console.log("🖼 Arquivo selecionado:", e.target.files[0].name);
      setFotoFile(e.target.files[0]);
    }
  };

  const handleRegister = async () => {
    console.log("📝 Iniciando registro de barbeiro");
    console.log("Campos atuais:", { nome, email, senha, fotoUrl, usarUrl, fotoFile });

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if ((usarUrl && !fotoUrl) || (!usarUrl && !fotoFile)) {
      alert("A foto é obrigatória!");
      return;
    }

    setLoading(true);

    try {
      let finalFotoUrl = "";

      if (usarUrl) {
        console.log("🌐 Usando URL da foto:", fotoUrl);
        finalFotoUrl = fotoUrl;
      } else if (fotoFile) {
        console.log("📦 Iniciando upload do arquivo para Supabase...");
        const fileExt = fotoFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("barbeiros") // 🔹 Bucket corrigido
          .upload(fileName, fotoFile);

        if (uploadError) {
          console.error("❌ Erro no upload:", uploadError);
          throw uploadError;
        }

        const { publicUrl } = supabase.storage.from("barbeiros").getPublicUrl(fileName);
        finalFotoUrl = publicUrl;
        console.log("✅ Upload concluído, URL pública:", finalFotoUrl);
      }

      console.log("📦 Payload enviado para API:", { nome, email, senha, foto: finalFotoUrl });

      const res = await fetch("/api/admin/createBarber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
body: JSON.stringify({ nome, email, password: senha, foto: finalFotoUrl })
      });

      const data = await res.json();
      console.log("📥 Resposta do servidor:", res.status, data);

      if (!res.ok) {
        alert("Erro: " + data?.error);
      } else {
        alert("Barbeiro criado com sucesso!");
        setNome("");
        setEmail("");
        setSenha("");
        setFotoUrl("");
        setFotoFile(null);
      }
    } catch (err) {
      console.error("❌ Erro inesperado ao criar barbeiro:", err);
      alert("Erro inesperado ao criar barbeiro.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg mt-12">
      <h1 className="text-2xl font-bold mb-4">Registrar Barbeiro</h1>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          className={`flex-1 py-2 rounded ${usarUrl ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setUsarUrl(true)}
        >
          Usar URL
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded ${!usarUrl ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setUsarUrl(false)}
        >
          Upload do PC
        </button>
      </div>

      {usarUrl ? (
        <input
          type="text"
          placeholder="URL da Foto "
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
      ) : (
        <div className="mb-3">
          <button
            type="button"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            onClick={() => fileInputRef.current?.click()}
          >
            Escolher ficheiro
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {fotoFile && <p className="mt-2 text-sm text-gray-600">{fotoFile.name}</p>}
        </div>
      )}

      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? "Criando..." : "Registrar Barbeiro"}
      </button>
    </div>
  );
}
