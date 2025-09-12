// /components/HeroBarbearia.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroBarbearia() {
  const particlesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!particlesRef.current) return;
      const particles = particlesRef.current.children;
      const x = e.clientX;
      const y = e.clientY;

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i] as HTMLElement;
        const speed = particle.dataset.speed ? parseFloat(particle.dataset.speed) : 1;
        const offsetX = (x - window.innerWidth / 2) * 0.01 * speed;
        const offsetY = (y - window.innerHeight / 2) * 0.01 * speed;
        particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Fundo do salão */}
      <img
        src="/images/barbearia.jpg" // coloque sua imagem de fundo aqui
        alt="Barbearia Estilo"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Partículas interativas */}
      <div ref={particlesRef} className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
            data-speed={`${0.5 + Math.random()}`}
          />
        ))}
      </div>

      {/* Elementos flutuantes de barbearia */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 animate-float-slow text-4xl">✂️</div>
        <div className="absolute top-1/3 right-10 animate-float text-4xl">🪒</div>
        <div className="absolute bottom-20 left-1/2 animate-float-slow text-4xl">🧴</div>
      </div>

      {/* Conteúdo do Hero */}
      <div className="text-center z-10 text-white px-4">
        <h1 className="text-6xl md:text-7xl font-bold drop-shadow-lg mb-4 animate-fadeIn">
          Barbearia Estilo
        </h1>
        <p className="text-xl md:text-2xl mb-6 animate-fadeIn delay-100">
          Onde o clássico encontra o moderno
        </p>
        <Link
          href="#servicos"
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 animate-fadeIn delay-200"
        >
          Explorar Serviços
        </Link>
      </div>

      {/* Estilos de animação */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes particle {
          0% { transform: translateY(0) scale(0.5); opacity: 0.2; }
          50% { transform: translateY(-50px) scale(1); opacity: 0.6; }
          100% { transform: translateY(0) scale(0.5); opacity: 0.2; }
        }

        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s forwards; }
        .animate-fadeIn.delay-100 { animation-delay: 0.1s; }
        .animate-fadeIn.delay-200 { animation-delay: 0.2s; }
        .animate-particle { animation: particle 6s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
