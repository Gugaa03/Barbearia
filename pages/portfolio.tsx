// pages/portfolio.tsx
"use client";

import Image from "next/image";

const cortes = [
  {
    id: 1,
    nome: "Fade Moderno",
    descricao: "Corte degradê moderno, ideal para um estilo atual e elegante.",
    imagem: "https://www.google.com/imgres?q=fade%20moderno&imgurl=https%3A%2F%2Fcontent.clara.es%2Fmedio%2F2024%2F06%2F12%2Fcortes-de-pelo-hombre-moderno-drop-fade_e2352a5b_240612130554_800x1000.webp&imgrefurl=https%3A%2F%2Fwww.clara.es%2Fbelleza%2F25-cortes-pelo-para-hombres-modernos-que-se-llevan-2025-y-actualizan-look_35650&docid=7g_olRPttUGhNM&tbnid=JEsxNNTvP0T_1M&vet=12ahUKEwj-8smv89aPAxVtVaQEHV5yBx4QM3oECCIQAA..i&w=800&h=1000&hcb=2&ved=2ahUKEwj-8smv89aPAxVtVaQEHV5yBx4QM3oECCIQAA",
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
