import Image from "next/image";

const cortes = [
  {
    id: 1,
    nome: "Fade Moderno",
    descricao: "Corte degradê moderno, ideal para um estilo atual e elegante.",
    imagem: "https://images.unsplash.com/photo-1600180758895-8d7a77f3314c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    nome: "Clássico Social",
    descricao: "Corte clássico, perfeito para ocasiões formais e profissionais.",
    imagem: "https://images.unsplash.com/photo-1588776814546-9a32c7a06b37?auto=format&fit=crop&w=800&q=80",
  },
  // ... restante dos cortes
];

export default function Portfolio() {
  return (
    <main className="py-12 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center">Portfólio de Cortes</h2>
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
