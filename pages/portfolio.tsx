// pages/portfolio.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

const cortes = [
  { id: 1, nome: "Fade Moderno", descricao: "Corte degradê moderno, ideal para um estilo atual e elegante.", imagem: "/Fotos/Fademoderno.jpg" },
  { id: 2, nome: "Clássico Social", descricao: "Corte clássico, perfeito para ocasiões formais e profissionais.", imagem: "/Fotos/Classicosocial.jpg" },
  { id: 3, nome: "Undercut Moderno", descricao: "Lateral raspada e topo mais longo para um visual ousado.", imagem: "/Fotos/Undercutmoderno.jpg" },
  { id: 4, nome: "Corte Texturizado", descricao: "Ideal para dar volume e movimento aos cabelos.", imagem: "/Fotos/Cortetexturizado.jpg" },
  { id: 5, nome: "Pompadour Clássico", descricao: "Elegância atemporal com volume no topo e laterais limpas.", imagem: "/Fotos/Pompadourclassico.jpg" },
  { id: 6, nome: "Buzz Cut", descricao: "Corte curto uniforme, prático e moderno.", imagem: "/Fotos/Buzzcut.jpg" },
  { id: 7, nome: "Corte com Franja", descricao: "Franja moderna para um look descontraído e jovem.", imagem: "/Fotos/Cortecomfranja.jpg" },
  { id: 8, nome: "Corte Curto Masculino", descricao: "Prático e estiloso, fácil de manter.", imagem: "/Fotos/Cortecurtomasculino.jpg" },
  { id: 9, nome: "Degradê Alto", descricao: "Transição suave e moderna entre laterais e topo.", imagem: "/Fotos/Degradealto.jpg" },
];

export default function Portfolio() {
  const [modalImage, setModalImage] = useState<string | null>(null);

  const openModal = (url: string) => setModalImage(url);
  const closeModal = () => setModalImage(null);

  return (
    <main className="py-12 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-center">Portfólio de Cortes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cortes.map((corte) => (
          <div key={corte.id} className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer" onClick={() => openModal(corte.imagem)}>
            <div className="relative w-full h-64">
              <Image src={corte.imagem} alt={corte.nome} fill className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{corte.nome}</h3>
              <p className="text-gray-600">{corte.descricao}</p>
            </div>
          </div>
        ))}
      </div>

      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
          {/* Botão X fixo */}
          <button
            className="fixed top-4 right-4 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-80 transition z-50"
            onClick={closeModal}
          >
            &times;
          </button>

          <div className="max-w-4xl w-full flex justify-center">
            <Image
              src={modalImage}
              alt="Foto do corte"
              width={1000}
              height={1000}
              className="rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
