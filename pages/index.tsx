// pages/index.tsx
"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // ajusta se o caminho da tua lib for diferente
import { useRouter } from "next/navigation";

const servicos = [
  { id: 1, nome: "Corte de Cabelo", descricao: "Clássico ou moderno, ao seu estilo.", preco: "15€", imagem: "https://images.unsplash.com/photo-1605497788044-5a32c7078486", categoria: "Corte" },
  { id: 2, nome: "Barba", descricao: "Aparar ou desenhar com perfeição.", preco: "10€", imagem: "https://images.unsplash.com/photo-1622288432441-4f42cae6d203", categoria: "Barba" },
  { id: 3, nome: "Corte + Barba", descricao: "Pacote completo para renovar o visual.", preco: "22€", imagem: "https://images.unsplash.com/photo-1614200179398-2e6f52f4a8a8", categoria: "Pacote" },
];

const galeria = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "https://images.unsplash.com/photo-1622288432441-4f42cae6d203",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486",
  "https://images.unsplash.com/photo-1621605815971-b9a2eecf7d98",
];

const depoimentos = [
  { id: 1, nome: "João Silva", texto: "Excelente atendimento! Saí renovado.", estrela: 5 },
  { id: 2, nome: "Maria Oliveira", texto: "Ambiente acolhedor e barbeiros profissionais.", estrela: 4 },
  { id: 3, nome: "Pedro Santos", texto: "Melhor lugar para cuidar do visual em Lisboa!", estrela: 5 },
];

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
   


      {/* Hero Section */}
      <section
        className="relative h-[90vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1622288432441-4f42cae6d203?auto=format&fit=crop&w=1950&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>
        
        <div className="text-center z-10 max-w-2xl px-4">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-2xl mb-6 animate-fadeIn">
            Seu Estilo, Nossa Arte
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fadeIn delay-100">
            Transformamos cortes em experiências únicas. 
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="#servicos"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full text-white font-semibold transition-transform transform hover:scale-105 shadow-lg animate-fadeIn delay-200"
            >
              Explorar Serviços
            </Link>
            <Link
              href="/marcacoes"
              className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full text-white font-semibold transition-transform transform hover:scale-105 shadow-lg animate-fadeIn delay-300"
            >
              Marque Já
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre Nós */}
      <section id="sobre" className="py-20 bg-gray-50 px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Sobre Nós</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Experiência</h3>
            <p>Mais de 10 anos transformando visuais com dedicação e técnica impecável.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Qualidade</h3>
            <p>Produtos de primeira linha e cortes adaptados ao seu estilo pessoal.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Atendimento</h3>
            <p>Ambiente acolhedor e profissionais dedicados para uma experiência única.</p>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section id="galeria" className="py-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10">O Nosso Espaço</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {galeria.map((foto, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-xl shadow-md hover:scale-105 transition-transform">
              <img src={foto} alt={`Galeria ${idx}`} className="w-full h-64 object-cover"/>
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-semibold text-lg transition-opacity">
                Espaço Estilo
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Os nossos serviços</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicos.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
                <img src={s.imagem} alt={s.nome} className="w-full h-48 object-cover"/>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{s.nome}</h3>
                  <p className="text-gray-600 mb-4">{s.descricao}</p>
                  <p className="text-lg font-bold mb-4">{s.preco}</p>
                  <Link href="/marcacoes" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Marcar já
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Depoimentos</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          {depoimentos.map(d => (
            <div key={d.id} className="bg-white shadow-lg p-6 rounded-xl hover:shadow-xl transition">
              <p className="mb-4">"{d.texto}"</p>
              <div className="flex items-center gap-1">
                {Array.from({length: d.estrela}).map((_, i) => <span key={i}>⭐</span>)}
              </div>
              <p className="mt-2 font-semibold">{d.nome}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-3">Contato</h4>
            <p>Rua das Tesouras, 123</p>
            <p>Lisboa, Portugal</p>
            <p>Tel: +351 912 345 678</p>
            <p>Email: info@barbearia.pt</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#sobre" className="hover:text-white">Sobre Nós</a></li>
              <li><a href="#galeria" className="hover:text-white">Galeria</a></li>
              <li><a href="#servicos" className="hover:text-white">Serviços</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Siga-nos</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600"><Facebook className="w-5 h-5 text-white"/></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-600"><Instagram className="w-5 h-5 text-white"/></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-sky-500"><Twitter className="w-5 h-5 text-white"/></a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8">
          © {new Date().getFullYear()} Barbearia Estilo. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
