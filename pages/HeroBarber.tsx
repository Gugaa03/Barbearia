"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function HeroBarbearia() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!particlesRef.current) return;
      const particles = particlesRef.current.children;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i] as HTMLElement;
        const speed = particle.dataset.speed ? parseFloat(particle.dataset.speed) : 1;
        const offsetX = (e.clientX - centerX) * 0.01 * speed;
        const offsetY = (e.clientY - centerY) * 0.01 * speed;
        particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Fundo do salão */}
      <Image
        src="/images/barbearia.jpg"
        alt="Barbearia Estilo"
        fill
        className="object-cover brightness-75 contrast-110"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Partículas interativas */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 animate-float-slow text-4xl select-none">✂️</div>
        <div className="absolute top-1/3 right-10 animate-float text-4xl select-none">🪒</div>
        <div className="absolute bottom-20 left-1/2 animate-float-slow text-4xl select-none -translate-x-1/2">🧴</div>
      </div>

      {/* Conteúdo do Hero */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-extrabold drop-shadow-lg mb-4 animate-fadeIn">
          Barbearia Estilo
        </h1>
        <p className="text-xl md:text-2xl mb-6 animate-fadeIn delay-100">
          Onde o clássico encontra o moderno
        </p>
        <Link
          href="#servicos"
          className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 animate-fadeIn delay-200"
        >
          Explorar Serviços
        </Link>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes particle {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-50px) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(0) scale(0.5);
            opacity: 0.2;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 1s forwards;
        }
        .animate-fadeIn.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fadeIn.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-particle {
          animation: particle 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
