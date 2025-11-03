import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ message = "Carregando...", fullScreen = true }: LoadingProps) {
  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 z-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="text-center">
        {/* Animated Scissors Icon */}
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl"
        >
          <Scissors className="w-12 h-12 text-white" />
        </motion.div>

        {/* Animated Text */}
        <motion.p
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-white text-xl font-semibold"
        >
          {message}
        </motion.p>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
              }}
              className="w-3 h-3 bg-blue-400 rounded-full"
            />
          ))}
        </div>

        {/* Spinner Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="mt-6 mx-auto w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full"
        />
      </div>
    </div>
  );
}

// Componente de loading inline (menor)
export function LoadingSpinner({ size = "md", color = "blue" }: { size?: "sm" | "md" | "lg"; color?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`${sizeClasses[size]} border-${color}-200 border-t-${color}-600 rounded-full`}
    />
  );
}
