import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setMessage(""); // Limpa mensagens anteriores

    if (!email || !password) {
      setMessage("⚠️ Preencha todos os campos");
      return;
    }

    // Login com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("❌ " + error.message);
      return;
    }

    if (data.user) {
      setMessage("✅ Login realizado com sucesso!");
      // Redireciona para dashboard ou página inicial
      router.push("/dashboard");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("⚠️ Informe seu email para receber o link de recuperação");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage(
        `✅ Um email foi enviado para ${email}. Clique no link para redefinir sua senha.`
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Entrar
        </h1>

        {message && (
          <p
            className={`mb-4 text-center ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Entrar
          </button>

          <button
            onClick={handleForgotPassword}
            className="w-full text-indigo-600 py-2 rounded-lg hover:underline focus:outline-none"
          >
            Esqueceu a senha?
          </button>
        </div>

        <p className="text-sm text-center text-gray-700 mt-6">
          Não tem uma conta?{" "}
          <a
            href="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Registrar
          </a>
        </p>
      </div>
    </div>
  );
}
