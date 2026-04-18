"use client"
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { Send, ArrowLeft, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'

// 1. Jembatan Sakti Supabase (Kunci sudah saya pasang langsung di sini)
const supabaseUrl = 'https://cwzdgheehnwckvbxzwrg.supabase.co'
const supabaseKey = 'EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3emRnaGVlaG53Y2t2Ynh6d3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0OTcwNTUsImV4cCI6MjA5MjA3MzA1NX0.La5hM_Id-pnF2Bs1WI-oWWJqZ9FYnilOVdTqv0ckLVM'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ChatPribadi() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [userLogin, setUserLogin] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfil')
    if (savedUser) setUserLogin(savedUser)

    // 2. Tarik data dari Database saat pertama buka
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
      setLoading(false)
    }
    fetchMessages()

    // 3. Mode Realtime: Mata-mata kalau Salsa balas pesan
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const newMessage = {
      sender: userLogin || 'Unknown',
      text: input,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }

    // 4. Kirim pesan langsung terbang ke Supabase (Bukan LocalStorage lagi)
    const { error } = await supabase.from('messages').insert([newMessage])
    if (error) {
      alert("Gagal kirim pesan! Pastikan kamu sudah buat tabel 'messages' di Supabase.")
      console.error(error)
    }
    
    setInput('')
  }

  const hapusSemuaChat = async () => {
    if (confirm('Yakin mau hapus semua obrolan Yudi & Salsa di server?')) {
      // Hapus semua data di tabel database
      const { error } = await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (!error) setMessages([])
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col font-sans text-gray-900">
      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 p-5 border-b flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/"><button className="p-2 bg-gray-100 rounded-full active:scale-90"><ArrowLeft size={20}/></button></Link>
          <div>
            <h1 className="text-sm font-black uppercase italic">Yudi & Salsa Sync</h1>
            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Server Database Active
            </p>
          </div>
        </div>
        <button onClick={hapusSemuaChat} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={20}/></button>
      </div>

      {/* AREA CHAT */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 opacity-20 font-black italic uppercase text-xs tracking-widest">Belum ada percakapan</div>
        ) : (
          messages.map((msg, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${msg.sender === userLogin ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-[24px] shadow-sm ${msg.sender === userLogin ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                <p className="text-[8px] font-black uppercase mb-1 opacity-60 tracking-tighter">{msg.sender}</p>
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                <p className="text-[7px] mt-2 text-right opacity-50 font-bold">{msg.time}</p>
              </div>
            </motion.div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT PESAN */}
      <div className="p-5 bg-white border-t sticky bottom-0">
        <div className="flex gap-2 bg-gray-100 p-2 rounded-[24px] border border-transparent focus-within:border-blue-200 transition-all">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Kirim pesan rahasia..." className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-bold text-gray-700" />
          <button onClick={handleSend} className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><Send size={18} /></button>
        </div>
      </div>
    </div>
  )
}
