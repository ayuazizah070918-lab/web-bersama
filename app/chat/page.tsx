"use client"
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft, User, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function ChatPribadi() {
  const [messages, setMessages] = useState<{ sender: string, text: string, time: string }[]>([])
  const [input, setInput] = useState('')
  const [userLogin, setUserLogin] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // 1. Ambil identitas login dan history chat saat pertama buka
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfil')
    if (savedUser) setUserLogin(savedUser)

    const savedChat = localStorage.getItem('chat_yudi_salsa_perm')
    if (savedChat) setMessages(JSON.parse(savedChat))
  }, [])

  // 2. Simpan chat ke memori setiap ada pesan baru
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_yudi_salsa_perm', JSON.stringify(messages))
    }
    // Auto scroll ke bawah
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    
    const newMessage = {
      sender: userLogin || 'Unknown',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')
  }

  const hapusSemuaChat = () => {
    if (confirm('Hapus semua riwayat chat Yudi & Salsa?')) {
      setMessages([])
      localStorage.removeItem('chat_yudi_salsa_perm')
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col font-sans text-gray-900">
      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 p-5 border-b flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/"><button className="p-2 bg-gray-100 rounded-full"><ArrowLeft size={20}/></button></Link>
          <div>
            <h1 className="text-sm font-black uppercase italic">Live Chat</h1>
            <p className="text-[10px] font-bold text-green-500 uppercase">Encrypted & Saved</p>
          </div>
        </div>
        <button onClick={hapusSemuaChat} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={20}/></button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center py-20 opacity-20 font-black italic uppercase text-xs">Belum ada pesan</div>
        )}
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            key={i} 
            className={`flex ${msg.sender === userLogin ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-[24px] shadow-sm ${
              msg.sender === userLogin 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              <p className="text-[9px] font-black uppercase mb-1 opacity-60">{msg.sender}</p>
              <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
              <p className="text-[8px] mt-2 text-right opacity-50 font-bold">{msg.time}</p>
            </div>
          </motion.div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-5 bg-white border-t sticky bottom-0">
        <div className="flex gap-2 bg-gray-100 p-2 rounded-[24px]">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tulis pesan..." 
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-bold"
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
