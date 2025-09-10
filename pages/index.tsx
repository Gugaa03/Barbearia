import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

const servicos = [
  {
    id: 1,
    nome: "Corte de Cabelo",
    descricao: "Corte clássico ou moderno, ao seu estilo.",
    preco: "15€",
    imagem: "https://images.unsplash.com/photo-1605497788044-5a32c7078486",
  },
  {
    id: 2,
    nome: "Barba",
    descricao: "Aparar ou desenhar a barba com perfeição.",
    preco: "10€",
    imagem: "https://images.unsplash.com/photo-1622288432441-4f42cae6d203",
  },
  {
    id: 3,
    nome: "Corte + Barba",
    descricao: "Pacote completo para renovar o visual.",
    preco: "22€",
    imagem: "https://images.unsplash.com/photo-1614200179398-2e6f52f4a8a8",
  },
];

const galeria = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "https://images.unsplash.com/photo-1622288432441-4f42cae6d203",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486",
  "https://images.unsplash.com/photo-1621605815971-b9a2eecf7d98",
  "https://images.unsplash.com/photo-1522336572468-97b06e8ef143",
  "https://images.unsplash.com/photo-1614200179398-2e6f52f4a8a8",
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-32 text-center relative">
        <h1 className="text-5xl font-bold mb-6">Barbearia Estilo</h1>
        <p className="text-lg mb-8">Onde o clássico encontra o moderno</p>
        <Link
          href="#servicos"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white font-semibold"
        >
          Explorar Serviços
        </Link>
      </section>

      {/* Sobre Nós */}
      <section
        id="sobre"
        className="py-20 bg-white text-gray-800 text-center px-6"
      >
        <h2 className="text-3xl font-bold mb-6">Sobre Nós</h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          A <strong>Barbearia Estilo</strong> nasceu da paixão por transformar
          visuais e proporcionar experiências únicas. Com mais de 10 anos de
          experiência, os nossos barbeiros unem técnica, estilo e dedicação para
          garantir que cada cliente saia não só com um corte impecável, mas
          também com confiança renovada.  
          <br /> <br />
          Aqui não é apenas um corte de cabelo, é um momento para si.
        </p>
      </section>

      {/* Galeria */}
      <section id="galeria" className="py-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10">O Nosso Espaço</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {galeria.map((foto, idx) => (
            <img
              key={idx}
              src={foto}
              alt={`Galeria ${idx}`}
              className="w-full h-64 object-cover rounded-xl shadow-md hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Os nossos serviços
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicos.map((servico) => (
              <div
                key={servico.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={servico.imagem}
                  alt={servico.nome}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{servico.nome}</h3>
                  <p className="text-gray-600 mb-4">{servico.descricao}</p>
                  <p className="text-lg font-bold mb-4">{servico.preco}</p>
                  <Link
                    href="/marcacoes"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Marcar já
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Info */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contato</h4>
            <p>Rua das Tesouras, 123</p>
            <p>Lisboa, Portugal</p>
            <p>Tel: +351 912 345 678</p>
            <p>Email: info@barbearia.pt</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#sobre" className="hover:text-white">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-white">
                  Galeria
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white">
                  Serviços
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Siga-nos</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-600"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-pink-600"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-sky-500"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 mt-8">
          © {new Date().getFullYear()} Barbearia Estilo. Todos os direitos
          reservados.
        </div>
      </footer>
    </div>
  );
}
