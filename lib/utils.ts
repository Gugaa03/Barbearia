import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Função utilitária para juntar classes Tailwind de forma inteligente
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
