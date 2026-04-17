"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, ArrowLeft, User } from 'lucide-react'
import Link from 'next/link'

export default function ChatKita() {
  const [pesan, setPesan] = useState('')
  const [currentUser, setCurrentUser] = useState('Salsa') // Default
  const [chatHistory, setChatHistory] = useState([
    { pengirim: 'Yudi', teks: 'Semangat jualan vouchernya hari ini, Sayang! ❤️' },
    { pengirim: 'Salsa', teks: 'Iyaaa, ini lagi rekap stok dulu hihi.' },
  ])

  // AMBIL PROFIL DARI LOGIN
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfil')
    if (savedUser) setCurrentUser(savedUser)
  }, [])

  const kirimPesan = () => {
    if (!pesan.trim()) return
    setChatHistory([...chatHistory, { pengirim: currentUser, teks: pesan }])
    setPesan('')
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col font-sans">
      {/* HEADER CHAT */}
      <div className="bg-white p-5 shadow-md flex items-center gap-4 sticky top-0 z-10">
        <Link href="/dashboard" className="p-2 bg-gray-100 rounded-full text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-gray-800 uppercase italic">Chat Bersama</h2>
            <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest">
              Login Sebagai: {currentUser}
            </p>
          </div>
        </div>
      </div>

      {/* AREA CHAT */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {chatHistory.map((c, i) => {
          // LOGIKA POSISI: 
          // Jika pengirim sama dengan user yang login -> KANAN
          // Jika berbeda -> KIRI
          const isMe = c.pengirim === currentUser

          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: isMe ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-[25px] shadow-sm ${
                isMe 
                ? 'bg-orange-500 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}>
                <p className={`text-[8px] font-black mb-1 uppercase opacity-70 ${isMe ? 'text-right' : 'text-left'}`}>
                  {c.pengirim}
                </p>
                <p className="text-sm font-medium leading-relaxed">{c.teks}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* INPUT PESAN */}
      <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center sticky bottom-0">
        <input 
          type="text" 
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          placeholder="Ketik sesuatu..."
          className="flex-1 bg-gray-50 p-4 rounded-2xl outline-none text-sm font-bold border focus:border-orange-400 transition-all"
        />
        <button 
          onClick={kirimPesan}
          className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 active:scale-90 transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
