// pages/portfolio.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scissors, Star } from "lucide-react";

const cortes = [
  { id: 1, nome: "Fade Moderno", descricao: "Corte degradê moderno, ideal para um estilo atual e elegante.", imagem: "/Fotos/Fademoderno.jpg", categoria: "Moderno", rating: 5 },
  { id: 2, nome: "Clássico Social", descricao: "Corte clássico, perfeito para ocasiões formais e profissionais.", imagem: "/Fotos/Classicosocial.jpg", categoria: "Clássico", rating: 5 },
  { id: 3, nome: "Undercut Moderno", descricao: "Lateral raspada e topo mais longo para um visual ousado.", imagem: "/Fotos/Undercutmoderno.jpg", categoria: "Moderno", rating: 5 },
  { id: 4, nome: "Corte Texturizado", descricao: "Ideal para dar volume e movimento aos cabelos.", imagem: "/Fotos/Cortetexturizado.jpg", categoria: "Moderno", rating: 4 },
  { id: 5, nome: "Pompadour Clássico", descricao: "Elegância atemporal com volume no topo e laterais limpas.", imagem: "/Fotos/Pompadourclassico.jpg", categoria: "Clássico", rating: 5 },
  { id: 6, nome: "Buzz Cut", descricao: "Corte curto uniforme, prático e moderno.", imagem: "/Fotos/Buzzcut.jpg", categoria: "Prático", rating: 4 },
  { id: 7, nome: "Corte com Franja", descricao: "Franja moderna para um look descontraído e jovem.", imagem: "/Fotos/Cortecomfranja.jpg", categoria: "Moderno", rating: 4 },
  { id: 8, nome: "Corte Curto Masculino", descricao: "Prático e estiloso, fácil de manter.", imagem: "/Fotos/Cortecurtomasculino.jpg", categoria: "Prático", rating: 5 },
  { id: 9, nome: "Degradê Alto", descricao: "Transição suave e moderna entre laterais e topo.", imagem: "/Fotos/Degradealto.jpg", categoria: "Moderno", rating: 5 },
];

const categorias = ["Todos", "Moderno", "Clássico", "Prático"];

export default function Portfolio() {
  const [modalImage, setModalImage] = useState<{ url: string; nome: string; descricao: string } | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const openModal = (url: string, nome: string, descricao: string) => setModalImage({ url, nome, descricao });
  const closeModal = () => setModalImage(null);

  const cortesFiltrados = categoriaAtiva === "Todos" 
    ? cortes 
    : cortes.filter(c => c.categoria === categoriaAtiva);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <main className="py-20 px-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <Scissors className="w-12 h-12 text-blue-600 animate-pulse-soft" />
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Portfólio de Cortes
          </h2>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore nossa galeria de estilos e encontre o corte perfeito para você
        </p>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        {categorias.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategoriaAtiva(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              categoriaAtiva === cat
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Gallery Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {cortesFiltrados.map((corte) => (
            <motion.div
              key={corte.id}
              variants={cardVariants}
              layout
              exit={{ opacity: 0, scale: 0.8 }}
              onHoverStart={() => setHoveredCard(corte.id)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => openModal(corte.imagem, corte.nome, corte.descricao)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer group relative"
            >
              {/* Image Container */}
              <div className="relative w-full h-72 overflow-hidden">
                <Image 
                  src={corte.imagem} 
                  alt={corte.nome} 
                  fill 
                  className={`object-cover transition-transform duration-500 ${
                    hoveredCard === corte.id ? "scale-110" : "scale-100"
                  }`}
                />
                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
                  hoveredCard === corte.id ? "opacity-100" : "opacity-0"
                }`}>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(corte.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white text-sm">{corte.descricao}</p>
                  </div>
                </div>
                {/* Category Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg">
                  {corte.categoria}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition">
                  {corte.nome}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">{corte.descricao}</p>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 border-2 border-blue-600 rounded-2xl transition-opacity duration-300 pointer-events-none ${
                hoveredCard === corte.id ? "opacity-100" : "opacity-0"
              }`}></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-12 right-0 text-white bg-red-600 rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700 transition shadow-lg z-10"
                onClick={closeModal}
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Image */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative w-full h-[500px]">
                  <Image
                    src={modalImage.url}
                    alt={modalImage.nome}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
                  <h3 className="text-2xl font-bold text-white mb-2">{modalImage.nome}</h3>
                  <p className="text-white/90">{modalImage.descricao}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
