"use client"
import { useState, useEffect, useRef } from 'react'
import { db } from '../lib/firebase'
import { ref, push, onValue, serverTimestamp } from 'firebase/database'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ChevronLeft, MoreVertical, CheckCheck } from 'lucide-react'
import Link from 'next/link'

export default function ChatWhatsApp() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [user] = useState('Yudi') // Nanti bisa otomatis dari login
  const scrollRef = useRef<HTMLDivElement>(null)

  // Ambil pesan dari Firebase secara Real-time
  useEffect(() => {
    const chatRef = ref(db, 'chats')
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }))
        setMessages(list)
      }
    })
  }, [])

  // Auto scroll ke bawah kalau ada pesan baru
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const kirimPesan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    await push(ref(db, 'chats'), {
      text: input,
      sender: user,
      timestamp: serverTimestamp()
    })
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen bg-[#efe7de] relative overflow-hidden">
      {/* HEADER WHATSAPP STYLE */}
      <div className="bg-[#075e54] p-4 flex items-center gap-3 text-white shadow-md z-10">
        <Link href="/dashboard"><ChevronLeft /></Link>
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden border border-white/20">
          <img src="https://ui-avatars.com/api/?name=Salsa&background=orange&color=fff" alt="Salsa" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-sm">Salsa ❤️</h2>
          <p className="text-[10px] text-green-200">Online</p>
        </div>
        <MoreVertical size={20} />
      </div>

      {/* AREA PESAN */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${msg.sender === user ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm relative ${
                msg.sender === user 
                ? 'bg-[#dcf8c6] rounded-tr-none' 
                : 'bg-white rounded-tl-none'
              }`}>
                <p className="text-sm text-gray-800 pb-1">{msg.text}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[9px] text-gray-500">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                  </span>
                  {msg.sender === user && <CheckCheck size={12} className="text-blue-500" />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* INPUT PESAN STYLE WA */}
      <form onSubmit={kirimPesan} className="p-3 bg-[#f0f0f0] flex items-center gap-2">
        <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center shadow-sm">
          <input 
            type="text" 
            placeholder="Ketik pesan..." 
            className="flex-1 bg-transparent outline-none text-sm py-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-[#075e54] p-3 rounded-full text-white shadow-lg active:scale-90 transition-all">
          <Send size={20} />
        </button>
      </form>

      {/* Background Pattern ala WA */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')` }}>
      </div>
    </div>
  )
}
