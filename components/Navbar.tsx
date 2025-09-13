// components/Navbar.tsx
"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md text-white px-6 py-4 flex justify-between items-center shadow-lg fixed w-full z-50">
      <Link href="/" className="text-2xl font-bold tracking-wide">✂️ Barbearia Estilo</Link>

      <div className="flex gap-6 items-center">
        {!user ? (
          <>
            <Link href="/login" className="hover:text-blue-400">Login</Link>
            <Link href="/signup" className="hover:text-blue-400">Registar</Link>
          </>
        ) : (
          <>
            {user.user_metadata?.role === "barber" && (
              <>
                <Link href="/admin/dashboard" className="hover:text-blue-400">Dashboard</Link>
                <Link href="/historicobarber" className="hover:text-blue-400">Agenda</Link>
                <Link href="/admin/addBarber" className="hover:text-blue-400">Registar Barbeiro</Link>
                <Link href="/portfolio" className="hover:text-blue-400">Portfólio</Link>
                <span className="font-semibold">Olá {user.user_metadata?.nome || "Barbeiro"}</span>
                <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
              </>
            )}
            {user.user_metadata?.role === "cliente" && (
              <>
                <Link href="/historico" className="hover:text-blue-400">Agenda</Link>
                <Link href="/portfolio" className="hover:text-blue-400">Portfólio</Link>
                <span className="font-semibold">Olá {user.user_metadata?.nome || "Cliente"}</span>
                <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  )
}
