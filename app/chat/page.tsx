"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, ChevronLeft, User } from 'lucide-react'
import Link from 'next/link'

export default function LiveChat() {
  const [myProfil, setMyProfil] = useState('Salsa')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: "Halo Yudi!", sender: "Salsa" },
    { id: 2, text: "Halo Salsa, semangat kerjanya!", sender: "Yudi" },
  ])

  useEffect(() => {
    const saved = localStorage.getItem('userProfil')
    if (saved) setMyProfil(saved)
  }, [])

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg = { id: Date.now(), text: input, sender: myProfil }
    setMessages([...messages, newMsg])
    setInput('')
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-[#F8FAFC]">
      {/* HEADER CHAT */}
      <div className="bg-white p-4 flex items-center gap-4 border-b shadow-sm">
        <Link href="/dashboard"><ChevronLeft className="text-gray-400" /></Link>
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md">
          <User size={20} />
        </div>
        <div>
          <h2 className="font-black text-gray-800 text-sm uppercase">{myProfil} (Profil Anda)</h2>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter animate-pulse">● Online Terus</p>
        </div>
      </div>

      {/* AREA PESAN */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-orange-50/30">
        {messages.map((msg) => {
          // LOGIKA POSISI: Salsa selalu di KIRI, Yudi selalu di KANAN
          const isSalsa = msg.sender === 'Salsa'
          
          return (
            <motion.div key={msg.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className={`flex w-full ${isSalsa ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-[25px] shadow-sm font-bold text-sm ${
                isSalsa 
                ? 'bg-white text-gray-800 rounded-bl-none border border-orange-100' 
                : 'bg-orange-500 text-white rounded-br-none shadow-orange-200'
              }`}>
                <p className={`text-[9px] uppercase mb-1 opacity-60 ${isSalsa ? 'text-orange-500' : 'text-orange-100'}`}>
                  {msg.sender}
                </p>
                {msg.text}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* INPUT PESAN */}
      <div className="p-4 bg-white border-t flex gap-2 items-center">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ketik pesan..." className="flex-1 bg-gray-100 p-4 rounded-2xl text-sm font-bold text-gray-900 outline-none focus:bg-gray-50 border-2 border-transparent focus:border-orange-200" />
        <button onClick={sendMessage} className="bg-orange-500 p-4 rounded-2xl text-white shadow-lg shadow-orange-200"><Send size={20} /></button>
      </div>
    </div>
  )
}
