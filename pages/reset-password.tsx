import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hashParams = new URLSearchParams(window.location.hash.replace("#", "?"));
      const type = hashParams.get("type");
      const access_token = hashParams.get("access_token");
      if (type === "recovery" && access_token) setToken(access_token);
    }
  }, []);

  const handleReset = async () => {
    if (!token) return setMessage("❌ Link inválido ou expirado");
    if (!newPassword) return setMessage("⚠️ Informe a nova senha");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      access_token: token,
    });

    if (error) setMessage("❌ " + error.message);
    else setMessage("✅ Senha redefinida com sucesso!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Redefinir Senha</h1>
        {message && <p className="mb-4 text-center">{message}</p>}
        {token && (
          <>
            <input
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-black mb-4"
            />
            <button
              onClick={handleReset}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Redefinir Senha
            </button>
          </>
        )}
      </div>
    </div>
  );
}
