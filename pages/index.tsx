// pages/index.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const servicos = [
  { id: 1, nome: "Corte de Cabelo", descricao: "Clássico ou moderno, ao seu estilo.", preco: "15€", imagem: "/Fotos/corte.jpg", categoria: "Corte" },
  { id: 2, nome: "Barba", descricao: "Aparar ou desenhar com perfeição.", preco: "10€", imagem: "/Fotos/barba.jpg", categoria: "Barba" },
  { id: 3, nome: "Corte + Barba", descricao: "Pacote completo para renovar o visual.", preco: "22€", imagem: "/Fotos/barbaecabelo.jpg", categoria: "Pacote" },
];

const galeria = [
  "/Fotos/espaco1.jpg",
  "/Fotos/espaco2.jpg",
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
      if (user) setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const fadeSlideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay } })
  };

  return (
    <div className="flex flex-col min-h-screen scroll-smooth">

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/Fotos/espaco1.jpg"
          alt="Barbearia"
          fill
          className="absolute inset-0 w-full h-full object-cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>
        <div className="text-center z-10 max-w-2xl px-4">
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-2xl mb-6"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            Seu Estilo, Nossa Arte
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-200 mb-8"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            Transformamos cortes em experiências únicas.
          </motion.p>
          <motion.div
            className="flex justify-center gap-4"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            custom={0.6}
          >
            <Link
              href="#servicos"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full text-white font-semibold transition-transform transform hover:scale-105 shadow-lg"
            >
              Explorar Serviços
            </Link>
            <Link
              href="/marcacoes"
              className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full text-white font-semibold transition-transform transform hover:scale-105 shadow-lg"
            >
              Marque Já
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sobre Nós */}
      <motion.section id="sobre" className="py-20 bg-gray-50 px-6 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="text-3xl font-bold mb-12" variants={fadeSlideUp} custom={0}>Sobre Nós</motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Experiência", "Qualidade", "Atendimento"].map((titulo, idx) => (
            <motion.div
              key={idx}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
              variants={fadeSlideUp}
              custom={0.2 * idx}
            >
              <h3 className="text-xl font-semibold mb-2">{titulo}</h3>
              <p>
                {titulo === "Experiência" && "Mais de 10 anos transformando visuais com dedicação e técnica impecável."}
                {titulo === "Qualidade" && "Produtos de primeira linha e cortes adaptados ao seu estilo pessoal."}
                {titulo === "Atendimento" && "Ambiente acolhedor e profissionais dedicados para uma experiência única."}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Galeria */}
      <motion.section id="galeria" className="py-20 bg-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="text-3xl font-bold text-center mb-10" variants={fadeSlideUp}>O Nosso Espaço</motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {galeria.map((foto, idx) => (
            <motion.div
              key={idx}
              className="relative overflow-hidden rounded-xl shadow-md hover:scale-105 transition-transform"
              variants={fadeSlideUp}
              custom={0.1 * idx}
            >
              <Image
                src={foto}
                alt={`Galeria ${idx}`}
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-semibold text-lg transition-opacity">
                Espaço Estilo
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Serviços */}
      <motion.section id="servicos" className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="text-3xl font-bold text-center mb-10" variants={fadeSlideUp}>Os nossos serviços</motion.h2>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicos.map((s, idx) => (
            <motion.div
              key={s.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
              variants={fadeSlideUp}
              custom={0.1 * idx}
            >
              <Image
                src={s.imagem}
                alt={s.nome}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{s.nome}</h3>
                <p className="text-gray-600 mb-4">{s.descricao}</p>
                <p className="text-lg font-bold mb-4">{s.preco}</p>
                <Link href="/marcacoes" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Marcar já
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Depoimentos */}
      <motion.section className="py-20 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="text-3xl font-bold text-center mb-10" variants={fadeSlideUp}>Depoimentos</motion.h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          {depoimentos.map((d, idx) => (
            <motion.div
              key={d.id}
              className="bg-white shadow-lg p-6 rounded-xl hover:shadow-xl transition"
              variants={fadeSlideUp}
              custom={0.1 * idx}
            >
              <p className="mb-4">"{d.texto}"</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: d.estrela }).map((_, i) => <span key={i}>⭐</span>)}
              </div>
              <p className="mt-2 font-semibold">{d.nome}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

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
