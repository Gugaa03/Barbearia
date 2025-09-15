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
      const { data } = await supabase.auth.getUser()
      console.log("Supabase auth.getUser() data:", data)
      setUser(data.user)
    }
    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Supabase auth.onAuthStateChange:", session)
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

  const nomeUsuario = user?.raw_user_meta_data?.full_name 
                     || user?.user_metadata?.full_name 
                     || user?.email 
                     || "Usuário"

  console.log("Navbar user object:", user)
  console.log("Nome do usuário detectado:", nomeUsuario)

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md text-white px-6 py-4 flex justify-between items-center shadow-lg fixed w-full z-50">
      <Link href="/" className="text-2xl font-bold tracking-wide">✂️ Barbearia Estilo</Link>

      {!user ? (
        <div className="flex gap-6 items-center">
          <Link href="/portfolio" className="hover:text-blue-400">Portfólio</Link>
          <Link href="/login" className="hover:text-blue-400">Login</Link>
          <Link href="/signup" className="hover:text-blue-400">Registar</Link>
        </div>
      ) : (
        <div className="flex gap-6 items-center">
          <Link href="/portfolio" className="hover:text-blue-400">Portfólio</Link>

          {user.user_metadata?.role === "barber" && (
            <>
              <Link href="/admin/dashboard" className="hover:text-blue-400">Dashboard</Link>
              <Link href="/historicobarber" className="hover:text-blue-400">Agenda</Link>
              <Link href="/admin/addBarber" className="hover:text-blue-400">Registar Barbeiro</Link>
              <span className="font-semibold">Olá {nomeUsuario}</span>
              <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
            </>
          )}

          {user.user_metadata?.role === "cliente" && (
            <>
              <Link href="/historico" className="hover:text-blue-400">Agenda</Link>
              <span className="font-semibold">Olá {nomeUsuario}</span>
              <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
