"use client";

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
/*  */
interface EditarBarbeiroProps {
  isOpen: boolean;
  onClose: () => void;
  barbeiro: {
    id: string;
    nome: string;
    foto?: string;
    role?: string;
  };
  onSave?: () => void; // callback opcional após salvar
}

export default function EditarBarbeiro({
  isOpen,
  onClose,
  barbeiro,
  onSave,
}: EditarBarbeiroProps) {
  const [nome, setNome] = useState(barbeiro.nome ?? "");
  const [role, setRole] = useState(barbeiro.role ?? "barber");
  const [fotoUrl, setFotoUrl] = useState(barbeiro.foto ?? "");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setNome(barbeiro.nome ?? "");
    setRole(barbeiro.role ?? "barber");
    setFotoUrl(barbeiro.foto ?? "");
    setFotoFile(null);
  }, [barbeiro]);

  const handleSave = async () => {
    setUploading(true);
    let finalFoto = fotoUrl;

    // Se houver arquivo selecionado, envia para Supabase Storage
    if (fotoFile) {
      const fileExt = fotoFile.name.split(".").pop();
      const fileName = `${barbeiro.id}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("barbers")
        .upload(fileName, fotoFile, { upsert: true });

      if (uploadError) {
        alert("Erro ao enviar foto: " + uploadError.message);
        setUploading(false);
        return;
      }

      const { publicUrl } = supabase.storage
        .from("barbers")
        .getPublicUrl(fileName);
      finalFoto = publicUrl;
    }

    // Atualizar dados no Supabase
    const { error } = await supabase
      .from("barbeiros")
      .update({
        nome,
        role,
        foto: finalFoto,
      })
      .eq("id", barbeiro.id);

    if (error) {
      alert("Erro ao atualizar barbeiro: " + error.message);
    } else {
      alert("Barbeiro atualizado com sucesso!");
      onSave?.();
      onClose();
    }

    setUploading(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md z-50">
        <Dialog.Title className="text-xl font-bold mb-4">
          Editar Barbeiro
        </Dialog.Title>

        <div className="flex flex-col gap-3">
          {/* Nome */}
          <label>
            Nome:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </label>

          {/* Role */}
          <label>
            Role:
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="barber">Barbeiro</option>
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {/* Foto via URL */}
          <div>
            <p className="font-medium mb-1">Foto via URL:</p>
            <input
              type="text"
              placeholder="URL da foto"
              value={fotoUrl}
              onChange={(e) => {
                setFotoUrl(e.target.value);
                setFotoFile(null);
              }}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Foto via upload */}
          <div>
            <p className="font-medium mb-1">Ou carregar do computador:</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setFotoFile(e.target.files[0]);
              }}
              className="border p-1 rounded"
            />
            {fotoFile && (
              <p className="text-sm text-gray-500 mt-1">
                Arquivo selecionado: {fotoFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Preview */}
        {(fotoUrl || fotoFile) && (
          <div className="mt-4 flex justify-center">
            <img
              src={fotoFile ? URL.createObjectURL(fotoFile) : fotoUrl}
              alt={nome}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={uploading}
          >
            {uploading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
