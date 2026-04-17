"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Gamepad2, Users, MonitorPlay, Sparkles, Heart } from 'lucide-react'

const daftarGame = [
  { nama: "Gartic Phone", desc: "Telepon Rusak: Gambar & Tebak bareng Salsa!", url: "https://garticphone.com/id", warna: "bg-purple-500" },
  { nama: "Ludo King Online", desc: "Main Ludo klasik di browser beda HP.", url: "https://www.ludoking.com/", warna: "bg-red-500" },
  { nama: "Uno Online", desc: "Adu strategi kartu UNO real-time.", url: "https://poki.com/en/g/uno-online", warna: "bg-orange-500" },
  { nama: "8 Ball Pool", desc: "Main biliar santai sambil nunggu pembeli.", url: "https://www.miniclip.com/games/8-ball-pool-multiplayer/", warna: "bg-blue-600" },
  { nama: "Slither.io", desc: "Jadi ular terbesar dan kepung lawan!", url: "http://slither.io/", warna: "bg-green-500" },
  { nama: "Chess.com", desc: "Asah otak main catur bareng.", url: "https://www.chess.com/play/online", warna: "bg-gray-700" }
]

export default function GamePage() {
  return (
    <div className="min-h-screen bg-[#F2F4F7] pb-20 font-sans">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-10 rounded-b-[50px] shadow-lg mb-8 relative">
        <Sparkles className="absolute top-6 right-6 text-white/10" size={100} />
        <Link href="/"><button className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md mb-6 active:scale-90 transition-all"><ArrowLeft size={24} /></button></Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center text-blue-500 shadow-2xl"><Gamepad2 size={36} /></div>
          <div className="text-white">
            <h1 className="text-2xl font-black italic uppercase">Fun Center</h1>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Heart size={12} className="fill-current"/> Salsa's Playground</p>
          </div>
        </div>
      </div>

      <div className="px-6 grid grid-cols-1 gap-4">
        {daftarGame.map((game, i) => (
          <motion.a key={i} href={game.url} target="_blank" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.96] transition-all">
            <div className={`w-14 h-14 ${game.warna} rounded-2xl flex items-center justify-center text-white shadow-lg`}><MonitorPlay size={24} /></div>
            <div className="flex-1">
              <h3 className="font-black text-gray-800 text-sm italic uppercase tracking-tight">{game.nama}</h3>
              <p className="text-[10px] font-bold text-gray-400 mt-0.5">{game.desc}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
