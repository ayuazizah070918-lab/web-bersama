"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, User, Heart } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Sesuai permintaanmu: id "yudisalsa" dan pw "30102007"
    if (username === 'yudisalsa' && password === '30102007') {
      router.push('/dashboard')
    } else {
      setError('ID atau Password salah, Sayang. Coba cek lagi ya! ❤️')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-[#FF8C00] to-[#87CEEB] p-4">
      {/* Animasi Masuk Halaman */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[350px] bg-white/20 backdrop-blur-lg rounded-[40px] p-8 shadow-2xl border border-white/30"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-full shadow-inner">
            <Heart className="text-orange-500 fill-orange-500 animate-pulse" size={40} />
          </div>
        </div>

        <h1 className="text-2xl font-black text-center text-white drop-shadow-md mb-2">
          WEB BERSAMA
        </h1>
        <p className="text-white/80 text-center text-xs mb-8 font-medium italic">
          "Yudi & Salsa Project"
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Input Username */}
          <div className="relative">
            <User className="absolute left-4 top-4 text-white/70" size={20} />
            <input 
              type="text"
              placeholder="ID Login"
              className="w-full py-4 pl-12 pr-4 bg-white/20 rounded-2xl outline-none text-white placeholder-white/60 border border-transparent focus:border-white transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Input Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-white/70" size={20} />
            <input 
              type="password"
              placeholder="Password"
              className="w-full py-4 pl-12 pr-4 bg-white/20 rounded-2xl outline-none text-white placeholder-white/60 border border-transparent focus:border-white transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-100 text-[10px] text-center bg-red-500/50 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          {/* Tombol Login Mewah */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-700/30 transition-all text-sm tracking-widest"
          >
            MASUK SEKARANG
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-[10px]">v1.0 Professional Programmer Style</p>
        </div>
      </motion.div>
    </div>
  )
}
