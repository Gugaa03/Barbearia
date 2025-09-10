import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

interface UserData {
  id: string;
  full_name?: string;
  email: string;
  role?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({
          id: user.id,
          full_name: user.user_metadata?.full_name,
          email: user.email || "",
          role: user.user_metadata?.role || "cliente",
        });
      } else {
        setUser(null);
      }
    };

    getUser();

    // Listener para mudanças de sessão (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name,
            email: session.user.email || "",
            role: session.user.user_metadata?.role || "cliente",
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          KingBarber
        </Link>

        {/* Links */}
        <div className="flex space-x-6 items-center">
          <Link href="/portfolio" className="hover:text-blue-600">
            Portfólio
          </Link>

          {/* Marcações de acordo com a role */}
          {user?.role === "admin" && (
            <Link href="/admin/marcacoes" className="hover:text-blue-600">
              Marcações Admin
            </Link>
          )}

          {user?.role === "cliente" && (
            <Link href="/marcacoes" className="hover:text-blue-600">
              Marcações
            </Link>
          )}

          {/* Sessão */}
          {!user ? (
            <>
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link href="/signup" className="hover:text-blue-600">
                Registar
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-700">
                Olá, {user.full_name || "Utilizador"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
