"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Gamepad2, Users, MonitorPlay, Sparkles } from 'lucide-react'

// Daftar Game Multiplayer Real-Time
const daftarGame = [
  {
    nama: "Gartic Phone",
    desc: "Game Telepon Rusak versi Menggambar. Bikin room, kasih link ke Salsa, dan ngakak bareng liat gambarnya!",
    url: "https://garticphone.com/id",
    warna: "bg-purple-500",
    shadow: "shadow-purple-200"
  },
  {
    nama: "Skribbl.io",
    desc: "Satu orang gambar, yang lain tebak kata. Seru banget buat diadu berdua atau banyakan.",
    url: "https://skribbl.io/",
    warna: "bg-blue-500",
    shadow: "shadow-blue-200"
  },
  {
    nama: "Tic Tac Toe (Online)",
    desc: "Game klasik X & O tapi bisa beda HP. Bikin room privat dan sikat!",
    url: "https://playtictactoe.org/",
    warna: "bg-orange-500",
    shadow: "shadow-orange-200"
  },
  {
    nama: "UNO Online",
    desc: "Main kartu UNO bareng! Tinggal create room dan jangan lupa bilang UNO!",
    url: "https://poki.com/en/g/uno-online",
    warna: "bg-red-500",
    shadow: "shadow-red-200"
  }
]

export default function GamePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Header Baru */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-8 rounded-b-[40px] shadow-lg mb-8 relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 text-white/20" size={80} />
        <Link href="/">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm mb-6 active:scale-90">
            <ArrowLeft size={20} />
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-xl">
            <Gamepad2 size={32} />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-black italic uppercase tracking-tight">Game Center</h1>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
               <Users size={12}/> Main Bareng Salsa
            </p>
          </div>
        </div>
      </div>

      {/* List Game */}
      <div className="px-6 space-y-5">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center mb-4">Pilih Game Multiplayer</p>
        
        {daftarGame.map((game, i) => (
          <motion.a 
            key={i}
            href={game.url} 
            target="_blank" // Membuka game di tab baru agar website kasir tidak tertutup
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="block bg-white p-5 rounded-[30px] shadow-sm border border-gray-100 active:scale-95 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 ${game.warna} rounded-2xl flex items-center justify-center text-white shadow-lg ${game.shadow} shrink-0`}>
                <MonitorPlay size={24} />
              </div>
              <div>
                <h3 className="font-black text-gray-800 text-lg italic uppercase">{game.nama}</h3>
                <p className="text-[11px] font-bold text-gray-400 mt-1 leading-relaxed">{game.desc}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
