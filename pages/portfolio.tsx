// pages/portfolio.tsx
"use client";

import Image from "next/image";

const cortes = [
  {
    id: 1,
    nome: "Fade Moderno",
    descricao: "Corte degradê moderno, ideal para um estilo atual e elegante.",
    imagem: "https://pin.it/6hLZAmYyz",
  },
  {
    id: 2,
    nome: "Clássico Social",
    descricao: "Corte clássico, perfeito para ocasiões formais e profissionais.",
    imagem: "https://images.unsplash.com/photo-1588776814546-9a32c7a06b37?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    nome: "Undercut Moderno",
    descricao: "Lateral raspada e topo mais longo para um visual ousado.",
    imagem: "https://images.unsplash.com/photo-1599058917212-5c2e3efc7b2f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    nome: "Corte Texturizado",
    descricao: "Ideal para dar volume e movimento aos cabelos.",
    imagem: "https://images.unsplash.com/photo-1614200179398-2e6f52f4a8a8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    nome: "Pompadour Clássico",
    descricao: "Elegância atemporal com volume no topo e laterais limpas.",
    imagem: "https://images.unsplash.com/photo-1599294737487-d915d7b2f3f3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    nome: "Buzz Cut",
    descricao: "Corte curto uniforme, prático e moderno.",
    imagem: "https://images.unsplash.com/photo-1580742439236-9a22d1f11a43?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    nome: "Corte com Franja",
    descricao: "Franja moderna para um look descontraído e jovem.",
    imagem: "https://images.unsplash.com/photo-1600180758895-8d7a77f3314c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    nome: "Corte Curto Masculino",
    descricao: "Prático e estiloso, fácil de manter.",
    imagem: "https://images.unsplash.com/photo-1588776814546-9a32c7a06b37?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    nome: "Degradê Alto",
    descricao: "Transição suave e moderna entre laterais e topo.",
    imagem: "https://images.unsplash.com/photo-1599058917212-5c2e3efc7b2f?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Portfolio() {
  return (
    <main className="py-12 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-center">Portfólio de Cortes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cortes.map((corte) => (
          <div key={corte.id} className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
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
    </main>
  );
}
