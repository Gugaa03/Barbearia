// /pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { useAutoLogout } from "../hooks/useAutoLogout"

export default function App({ Component, pageProps }: AppProps) {
  useAutoLogout();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20"> {/* padding para não ficar por baixo da navbar fixa */}
        <Component {...pageProps} />
      </div>
    </div>
  );
}
