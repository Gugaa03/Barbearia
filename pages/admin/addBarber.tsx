"use client";

import { useState, useRef } from "react";

export default function RegisterBarber() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFotoFile(file);
  };

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if (!fotoFile) {
      alert("Selecione um arquivo antes de enviar!");
      return;
    }

    setLoading(true);

    try {
      const arrayBuffer = await fotoFile.arrayBuffer();
      const finalFotoBase64 = Buffer.from(arrayBuffer).toString("base64");

      const res = await fetch("/api/admin/createBarber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          password: senha,
          fotoFile: finalFotoBase64, // envia base64
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro desconhecido");

      alert(`Barbeiro criado com sucesso!`);
      setNome(""); 
      setEmail(""); 
      setSenha(""); 
      setFotoFile(null);
    } catch (err: any) {
      console.error("Erro inesperado:", err);
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
