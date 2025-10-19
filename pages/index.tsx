"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

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

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: custom, ease: [0.43, 0.13, 0.23, 0.96] },
  }),
};

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="flex flex-col min-h-screen scroll-smooth font-poppins bg-gradient-to-b from-gray-50 to-white text-gray-800"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/Fotos/espaco1.jpg"
          alt="Barbearia"
          fill
          className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-110"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
        <div className="text-center z-10 max-w-3xl px-6">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mb-6 tracking-wide"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            Seu Estilo, Nossa Arte
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-gray-200 mb-10 tracking-wide"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            Transformamos cortes em experiências únicas.
          </motion.p>
          <motion.div
            className="flex justify-center gap-6"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            custom={0.6}
          >
            <Link
              href="#servicos"
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-10 py-3 rounded-full text-white font-semibold transition-transform transform hover:scale-105 shadow-xl"
            >
              Explorar Serviços
            </Link>
            <Link
              href="/marcacoes"
              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 px-10 py-3 rounded-full text-white font-semibold transition-transform transform hover:scale-105 shadow-xl"
            >
              Marque Já
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sobre Nós */}
      <motion.section
        id="sobre"
        className="py-24 bg-white px-8 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-4xl font-bold mb-16 tracking-wide text-gray-900"
          variants={fadeSlideUp}
          custom={0}
        >
          Sobre Nós
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {["Experiência", "Qualidade", "Atendimento"].map((titulo, idx) => (
            <motion.div
              key={idx}
              className="bg-gradient-to-tr from-white via-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow cursor-default"
              variants={fadeSlideUp}
              custom={0.2 * idx}
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">{titulo}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {titulo === "Experiência" && "Mais de 10 anos transformando visuais com dedicação e técnica impecável."}
                {titulo === "Qualidade" && "Produtos de primeira linha e cortes adaptados ao seu estilo pessoal."}
                {titulo === "Atendimento" && "Ambiente acolhedor e profissionais dedicados para uma experiência única."}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Galeria */}
      <motion.section
        id="galeria"
        className="py-24 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="text-4xl font-bold text-center mb-14 tracking-wide text-gray-900" variants={fadeSlideUp}>
          O Nosso Espaço
        </motion.h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
          {galeria.map((foto, idx) => (
            <motion.div
              key={idx}
              className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-[1.04]"
              variants={fadeSlideUp}
              custom={0.1 * idx}
            >
              <Image
                src={foto}
                alt={`Galeria ${idx + 1}`}
                width={600}
                height={400}
                className="w-full h-64 object-cover rounded-3xl"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-semibold text-lg transition-opacity rounded-3xl backdrop-blur-sm">
                Espaço Estilo
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Serviços */}
      <motion.section
        id="servicos"
        className="py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-4xl font-bold text-center mb-14 tracking-wide text-gray-900"
          variants={fadeSlideUp}
        >
          Os nossos serviços
        </motion.h2>
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {servicos.map((s, idx) => (
            <motion.div
              key={s.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1 hover:scale-[1.03]"
              variants={fadeSlideUp}
              custom={0.1 * idx}
            >
              <Image
                src={s.imagem}
                alt={s.nome}
                width={600}
                height={400}
                className="w-full h-56 object-cover rounded-t-3xl"
              />
              <div className="p-7">
                <h3 className="text-2xl font-semibold mb-3">{s.nome}</h3>
                <p className="text-gray-600 mb-5 text-lg">{s.descricao}</p>
                <p className="text-xl font-bold mb-6 text-blue-700">{s.preco}</p>
                <Link
                  href="/marcacoes"
                  className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105"
                >
                  Marcar já
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Depoimentos */}
      <motion.section
        className="py-24 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-4xl font-bold text-center mb-14 tracking-wide text-gray-900"
          variants={fadeSlideUp}
        >
          Depoimentos
        </motion.h2>
        <div className="max-w-4xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          {depoimentos.map((d, idx) => (
            <motion.div
              key={d.id}
              className="bg-white rounded-3xl p-7 shadow-lg hover:shadow-2xl transition cursor-default"
              variants={fadeSlideUp}
              custom={0.1 * idx}
            >
              <p className="mb-4 text-gray-700 text-lg leading-relaxed">"{d.texto}"</p>
              <p className="font-semibold text-gray-900">{d.nome}</p>
              <p className="text-yellow-400 mt-2">
                {"⭐".repeat(d.estrela)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm">&copy; {new Date().getFullYear()} Barbearia Estilo. Todos os direitos reservados.</p>
          <div className="flex gap-6 text-gray-400">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition">
              <Facebook size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition">
              <Instagram size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-white transition">
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
