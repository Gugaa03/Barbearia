// /components/Navbar.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface UserSession {
  id: string;
  email: string;
  user_metadata?: {
    nome?: string;
  };
}

export default function Navbar() {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user as UserSession);
      }
    };

    getUser();

    // Listener para mudanças na sessão (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as UserSession);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-xl font-bold hover:text-gray-300">
          Barbearia
        </Link>
        <Link href="/marcacoes" className="hover:text-gray-300">
          Marcações
        </Link>
        <Link href="/portfolio" className="hover:text-gray-300">
          Portefólio
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link href="/signup" className="hover:text-gray-300">
              Registo
            </Link>
            <Link href="/login" className="hover:text-gray-300">
              Login
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm">
              👋 Olá,{" "}
              <span className="font-semibold">
                {user.user_metadata?.nome || user.email}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
