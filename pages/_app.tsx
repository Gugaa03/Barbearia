// /pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20"> {/* padding para não ficar por baixo da navbar fixa */}
        <Component {...pageProps} />
      </div>
    </div>
  )
}