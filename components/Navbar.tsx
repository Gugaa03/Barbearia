"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { motion } from "framer-motion"
import { Scissors, Menu, X, User, LogOut } from "lucide-react"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    setIsMenuOpen(false)
  }

  const nomeUsuario = user?.raw_user_meta_data?.full_name 
                     || user?.user_metadata?.full_name 
                     || user?.email 
                     || "Usuário"

  console.log("Navbar user object:", user)
  console.log("Nome do usuário detectado:", nomeUsuario)

  const linkClasses = "relative px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 group"
  const underlineClasses = "absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 backdrop-blur-md text-white px-6 py-4 shadow-lg fixed w-full z-50 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-wide hover:scale-105 transition-transform">
          <Scissors className="w-7 h-7 text-blue-400 animate-pulse-soft" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Barbearia Estilo
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {!user ? (
            <>
              <Link href="/portfolio" className={linkClasses}>
                Portfólio
                <span className={underlineClasses}></span>
              </Link>
              <Link href="/login" className={linkClasses}>
                Login
                <span className={underlineClasses}></span>
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Registar
              </Link>
            </>
          ) : (
            <>
              <Link href="/portfolio" className={linkClasses}>
                Portfólio
                <span className={underlineClasses}></span>
              </Link>

              {user.user_metadata?.role === "barber" && (
                <>
                  <Link href="/admin/dashboard" className={linkClasses}>
                    Dashboard
                    <span className={underlineClasses}></span>
                  </Link>
                  <Link href="/historicobarber" className={linkClasses}>
                    Agenda
                    <span className={underlineClasses}></span>
                  </Link>
                  <Link href="/admin/addBarber" className={linkClasses}>
                    Registar Barbeiro
                    <span className={underlineClasses}></span>
                  </Link>
                </>
              )}

              {user.user_metadata?.role === "cliente" && (
                <Link href="/historico" className={linkClasses}>
                  Agenda
                  <span className={underlineClasses}></span>
                </Link>
              )}

              <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <User className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">Olá, {nomeUsuario.split(' ')[0]}</span>
              </div>

              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 bg-red-600/80 rounded-full hover:bg-red-700 transition-all transform hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 pb-4 border-t border-white/10"
        >
          <div className="flex flex-col gap-3 pt-4">
            {!user ? (
              <>
                <Link href="/portfolio" className="px-4 py-2 hover:bg-white/10 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                  Portfólio
                </Link>
                <Link href="/login" className="px-4 py-2 hover:bg-white/10 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-center" onClick={() => setIsMenuOpen(false)}>
                  Registar
                </Link>
              </>
            ) : (
              <>
                <Link href="/portfolio" className="px-4 py-2 hover:bg-white/10 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                  Portfólio
                </Link>

                {user.user_metadata?.role === "barber" && (
                  <>
                    <Link href="/admin/dashboard" className="px-4 py-2 hover:bg-white/10 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link href="/historicobarber" className="px-4 py-2 hover:bg-white/10 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                      Agenda
                    </Link>
                    <Link href="/admin/addBarber" className="px-4 py-2 hover:bg-white/10 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                      Registar Barbeiro
                    </Link>
                  </>
                )}

                {user.user_metadata?.role === "cliente" && (
                  <Link href="/historico" className="px-4 py-2 hover:bg-white/10 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    Agenda
                  </Link>
                )}

                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <span className="font-semibold">Olá, {nomeUsuario}</span>
                </div>

                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 bg-red-600/80 rounded-lg hover:bg-red-700 transition text-left"
                >
                  Sair
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
