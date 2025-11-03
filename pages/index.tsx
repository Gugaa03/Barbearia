"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Scissors, Clock, MapPin, Phone, Mail, Star, Award, Users, TrendingUp, ChevronDown, Sparkles, Calendar, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { motion, Variants, useScroll, useTransform } from "framer-motion";

const servicos = [
  { id: 1, nome: "Corte de Cabelo", descricao: "Clássico ou moderno, ao seu estilo.", preco: "15€", imagem: "/Fotos/corte.jpg", categoria: "Corte", icon: "✂️" },
  { id: 2, nome: "Barba", descricao: "Aparar ou desenhar com perfeição.", preco: "10€", imagem: "/Fotos/barba.jpg", categoria: "Barba", icon: "🪒" },
  { id: 3, nome: "Corte + Barba", descricao: "Pacote completo para renovar o visual.", preco: "22€", imagem: "/Fotos/barbaecabelo.jpg", categoria: "Pacote", icon: "💈" },
];

const galeria = [
  "/Fotos/espaco1.jpg",
  "/Fotos/espaco2.jpg",
];

const depoimentos = [
  { id: 1, nome: "João Silva", texto: "Excelente atendimento! Saí renovado.", estrela: 5, avatar: "JS" },
  { id: 2, nome: "Maria Oliveira", texto: "Ambiente acolhedor e barbeiros profissionais.", estrela: 4, avatar: "MO" },
  { id: 3, nome: "Pedro Santos", texto: "Melhor lugar para cuidar do visual em Lisboa!", estrela: 5, avatar: "PS" },
];

const estatisticas = [
  { id: 1, numero: "10+", label: "Anos de Experiência", icon: Award },
  { id: 2, numero: "5000+", label: "Clientes Satisfeitos", icon: Users },
  { id: 3, numero: "98%", label: "Avaliações Positivas", icon: TrendingUp },
  { id: 4, numero: "15+", label: "Barbeiros Profissionais", icon: Scissors },
];

const horarioFuncionamento = [
  { dia: "Segunda - Sexta", horario: "09:00 - 20:00" },
  { dia: "Sábado", horario: "09:00 - 18:00" },
  { dia: "Domingo", horario: "Fechado" },
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
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div
      className="flex flex-col min-h-screen scroll-smooth font-poppins bg-gradient-to-b from-gray-50 to-white text-gray-800"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >

      {/* Hero Section - Clean */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <Image
              src="/Fotos/espaco1.jpg"
              alt="Barbearia Estilo"
              fill
              className="object-cover"
              quality={100}
              priority
            />
          </div>
          
          {/* Overlays com gradientes */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-transparent to-purple-900/50"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/10 to-pink-600/20"></div>
        </div>

        {/* Conteúdo Central */}
        <div className="text-center z-10 max-w-6xl px-6">
          {/* Logo Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-2xl">
              <Scissors className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          {/* Título Principal */}
          <motion.h1
            className="text-7xl md:text-8xl lg:text-[10rem] font-black text-white mb-10 tracking-tighter leading-none"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            style={{
              textShadow: "0 0 60px rgba(59, 130, 246, 0.8), 0 0 120px rgba(139, 92, 246, 0.6), 0 10px 30px rgba(0,0,0,1)",
              WebkitTextStroke: "2px rgba(255,255,255,0.1)",
            }}
          >
            Seu Estilo,{" "}
            <span 
              className="block mt-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative"
              style={{
                filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.8))",
              }}
            >
              Nossa Arte
              <div className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
            </span>
          </motion.h1>
          
          {/* Subtítulo */}
          <motion.p
            className="text-2xl md:text-4xl lg:text-5xl text-gray-100 mb-14 tracking-wide font-light max-w-4xl mx-auto"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            style={{
              textShadow: "0 4px 20px rgba(0,0,0,0.9), 0 0 40px rgba(59, 130, 246, 0.3)",
            }}
          >
            Transformamos cortes em experiências{" "}
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 relative inline-block">
              únicas
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
            </span>
          </motion.p>
          
          {/* Botões de ação */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-6"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            custom={0.6}
          >
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.8)" }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/marcacoes"
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 px-12 py-6 rounded-full text-white font-bold text-lg shadow-2xl overflow-hidden border-2 border-white/20"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>
                <Calendar className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Agendar Agora</span>
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 255, 255, 0.5)" }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="#servicos"
                className="group inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl border-2 border-white/40 hover:bg-white/30 hover:border-white/60 px-12 py-6 rounded-full text-white font-bold text-lg shadow-2xl transition-all"
              >
                <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                Nossos Serviços
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator animado */}
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-white/70 text-sm font-medium">Deslize para baixo</span>
              <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                <motion.div
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-white rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Estatísticas */}
      <motion.section
        className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
            variants={fadeSlideUp}
          >
            Números que{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Impressionam
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {estatisticas.map((stat, idx) => (
              <motion.div
                key={stat.id}
                variants={fadeSlideUp}
                custom={0.1 * idx}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 * idx }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-xl"
                >
                  <stat.icon className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h3
                  className="text-5xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 * idx }}
                >
                  {stat.numero}
                </motion.h3>
                <p className="text-blue-200 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Sobre Nós - Melhorado */}
      <motion.section
        id="sobre"
        className="py-24 bg-white px-8 text-center relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Background decorativo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <Scissors className="absolute top-10 left-10 w-32 h-32 text-blue-600 transform rotate-45" />
          <Scissors className="absolute bottom-10 right-10 w-32 h-32 text-purple-600 transform -rotate-45" />
        </div>

        <motion.h2
          className="text-5xl font-bold mb-6 tracking-tight text-gray-900"
          variants={fadeSlideUp}
          custom={0}
        >
          Por que escolher a{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Barbearia Estilo
          </span>
          ?
        </motion.h2>
        
        <motion.p
          className="text-gray-600 text-xl mb-16 max-w-3xl mx-auto"
          variants={fadeSlideUp}
          custom={0.1}
        >
          Somos mais do que uma barbearia, somos uma experiência completa de cuidado e estilo
        </motion.p>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          {[
            {
              titulo: "Experiência",
              descricao: "Mais de 10 anos transformando visuais com dedicação e técnica impecável.",
              icon: Award,
              color: "from-blue-500 to-blue-700"
            },
            {
              titulo: "Qualidade",
              descricao: "Produtos de primeira linha e cortes adaptados ao seu estilo pessoal.",
              icon: Star,
              color: "from-purple-500 to-purple-700"
            },
            {
              titulo: "Atendimento",
              descricao: "Ambiente acolhedor e profissionais dedicados para uma experiência única.",
              icon: Users,
              color: "from-pink-500 to-pink-700"
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="group bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-default border border-gray-100 relative overflow-hidden"
              variants={fadeSlideUp}
              custom={0.2 * idx}
              whileHover={{ y: -10 }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform`}></div>
              
              <motion.div
                className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl mb-6 shadow-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <item.icon className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{item.titulo}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {item.descricao}
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

      {/* Serviços - Melhorado */}
      <motion.section
        id="servicos"
        className="py-24 bg-gradient-to-br from-gray-50 to-blue-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-16">
          <motion.h2
            className="text-5xl font-bold mb-6 tracking-tight text-gray-900"
            variants={fadeSlideUp}
          >
            Nossos{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Serviços
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-600 text-xl max-w-2xl mx-auto"
            variants={fadeSlideUp}
            custom={0.1}
          >
            Oferecemos o melhor em cortes e cuidados para você
          </motion.p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {servicos.map((s, idx) => (
            <motion.div
              key={s.id}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all relative"
              variants={fadeSlideUp}
              custom={0.1 * idx}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Badge de ícone */}
              <div className="absolute top-4 left-4 z-10 bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-2xl">
                {s.icon}
              </div>

              {/* Badge de preço */}
              <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                {s.preco}
              </div>

              <div className="relative h-64 overflow-hidden">
                <Image
                  src={s.imagem}
                  alt={s.nome}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="p-7">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition">
                  {s.nome}
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {s.descricao}
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/marcacoes"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all w-full justify-center"
                  >
                    <Calendar className="w-5 h-5" />
                    Agendar Agora
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Depoimentos - Melhorado */}
      <motion.section
        className="py-24 bg-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"></div>

        <motion.div className="text-center mb-16 relative z-10">
          <motion.h2
            className="text-5xl font-bold mb-6 tracking-tight text-gray-900"
            variants={fadeSlideUp}
          >
            O que dizem nossos{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Clientes
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-600 text-xl max-w-2xl mx-auto"
            variants={fadeSlideUp}
            custom={0.1}
          >
            Experiências reais de quem confia no nosso trabalho
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {depoimentos.map((d, idx) => (
            <motion.div
              key={d.id}
              className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 relative overflow-hidden"
              variants={fadeSlideUp}
              custom={0.1 * idx}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 text-9xl font-bold text-blue-100 opacity-50 transform translate-x-4 -translate-y-4">
                "
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {d.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{d.nome}</p>
                  <div className="flex gap-1">
                    {[...Array(d.estrela)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-4 relative z-10 italic">
                "{d.texto}"
              </p>

              {/* Quote decoration */}
              <div className="absolute bottom-4 right-4 opacity-20">
                <Scissors className="w-16 h-16 text-blue-600 transform rotate-12" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Horário e Localização */}
      <motion.section
        className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.h2
            className="text-5xl font-bold text-center mb-16"
            variants={fadeSlideUp}
          >
            Visite-nos
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Horário de Funcionamento */}
            <motion.div
              variants={fadeSlideUp}
              custom={0.2}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold">Horário de Funcionamento</h3>
              </div>
              <div className="space-y-4">
                {horarioFuncionamento.map((h, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 border-b border-white/20 last:border-0">
                    <span className="text-gray-300 font-medium">{h.dia}</span>
                    <span className="text-white font-bold">{h.horario}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contato */}
            <motion.div
              variants={fadeSlideUp}
              custom={0.4}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold">Onde Estamos</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-300">Endereço</p>
                    <p className="text-white">Rua da Barbearia, 123<br />Lisboa, Portugal</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-300">Telefone</p>
                    <p className="text-white">+351 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-300">Email</p>
                    <p className="text-white">contato@barbearia.pt</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer - Melhorado */}
      <footer className="bg-gray-950 text-gray-400 py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Sobre */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Barbearia Estilo</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transformando estilos e criando experiências únicas há mais de 10 anos.
              </p>
            </div>

            {/* Links Rápidos */}
            <div>
              <h4 className="text-white font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><Link href="#sobre" className="hover:text-blue-400 transition">Sobre Nós</Link></li>
                <li><Link href="#servicos" className="hover:text-blue-400 transition">Serviços</Link></li>
                <li><Link href="/portfolio" className="hover:text-blue-400 transition">Portfólio</Link></li>
                <li><Link href="/marcacoes" className="hover:text-blue-400 transition">Agendar</Link></li>
              </ul>
            </div>

            {/* Horário */}
            <div>
              <h4 className="text-white font-bold mb-4">Horário</h4>
              <ul className="space-y-2 text-sm">
                <li>Seg - Sex: 09:00 - 20:00</li>
                <li>Sábado: 09:00 - 18:00</li>
                <li>Domingo: Fechado</li>
              </ul>
            </div>

            {/* Redes Sociais */}
            <div>
              <h4 className="text-white font-bold mb-4">Siga-nos</h4>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.1, y: -3 }}
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition"
                >
                  <Facebook size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -3 }}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center transition"
                >
                  <Instagram size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -3 }}
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition"
                >
                  <Twitter size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -3 }}
                  href="https://github.com/gugaa03"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition"
                >
                  <Github size={20} />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">
              &copy; 2025 Barbearia Estilo. Todos os direitos reservados.
              <span className="mx-2">|</span>
              Desenvolvido por{" "}
              <a 
                href="https://github.com/gugaa03" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold transition"
              >
                @Gugaa03
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
