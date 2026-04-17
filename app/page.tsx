"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Gamepad2, User, Calculator, X, History, Trash2, Bot, Send, Loader2, Coins, Package, LogOut, Wallet } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  // --- 1. STATE MANAGEMENT ---
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userLogin, setUserLogin] = useState('')
  const [isCalcOpen, setIsCalcOpen] = useState(false)
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [calcInput, setCalcInput] = useState('')
  const [calcHistory, setCalcHistory] = useState<string[]>([])
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isLoadingAi, setIsLoadingAi] = useState(false)
  
  const [chipData, setChipData] = useState({ hargaJual: 65000, masuk: 0, keluar: 0 })
  const [adminData, setAdminData] = useState({ dana: 0, chip: 0 }) // State baru untuk Admin
  const [vocers, setVocers] = useState([
    { nama: 'Axis 3GB', rumus: '0', harga: 15000 },
    { nama: 'Axis 5GB', rumus: '0', harga: 20000 },
    { nama: 'Tri 4GB', rumus: '0', harga: 15000 },
    { nama: 'XL 3GB', rumus: '0', harga: 5000 },
    { nama: 'Smartfren', rumus: '0', harga: 20000 },
    { nama: 'T-Sel', rumus: '0', harga: 30000 },
  ])

  // --- 2. LOGIC & STORAGE ---
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfil')
    const savedHistory = localStorage.getItem('calcHistory')
    if (savedUser) {
      setUserLogin(savedUser)
      setIsLoggedIn(true)
    }
    if (savedHistory) setCalcHistory(JSON.parse(savedHistory))
  }, [])

  const handleLogin = (name: string) => {
    setUserLogin(name)
    setIsLoggedIn(true)
    localStorage.setItem('userProfil', name)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('userProfil')
  }

  const hitungStok = (rumus: string) => {
    try { 
      const cleanRumus = rumus.replace(/[^-+*/0-9.]/g, '')
      return eval(cleanRumus) || 0 
    } catch { return 0 }
  }

  const calculateResult = () => {
    try {
      if (!calcInput) return
      const result = eval(calcInput).toString()
      const newHistory = [`${calcInput} = ${result}`, ...calcHistory].slice(0, 10)
      setCalcHistory(newHistory)
      localStorage.setItem('calcHistory', JSON.stringify(newHistory))
      setCalcInput(result)
    } catch { setCalcInput('Error') }
  }

  // Menambahkan adminData.dana dan adminData.chip ke total keseluruhan
  const totalSemua = vocers.reduce((acc, v) => acc + (hitungStok(v.rumus) * v.harga), 0) + (chipData.keluar * chipData.hargaJual) + adminData.dana + adminData.chip

  // --- 3. FUNGSI AI (GEMINI) ---
  const tanyaGemini = async () => {
    if (!aiPrompt.trim()) return
    setIsLoadingAi(true)
    setAiResponse('Sedang berpikir...')
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: aiPrompt }] }]
        })
      })

      const data = await response.json()

      if (data.candidates && data.candidates[0].content) {
        setAiResponse(data.candidates[0].content.parts[0].text)
        setAiPrompt('')
      } else if (data.error) {
        setAiResponse(`API Error: ${data.error.message}`)
      } else {
        setAiResponse("Maaf, AI tidak memberikan respon. Cek koneksi.")
      }
    } catch (error) {
      setAiResponse("Koneksi gagal. Pastikan internet aktif dan API Key benar.")
    } finally {
      setIsLoadingAi(false)
    }
  }

  // --- 4. TAMPILAN LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl text-center">
          <div className="w-20 h-20 bg-orange-500 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg"><User size={40} /></div>
          <h2 className="text-2xl font-black text-gray-800 mb-2 italic">PILIH PROFIL</h2>
          <p className="text-gray-400 text-xs font-bold mb-8 uppercase tracking-widest">Web Pro v5.4</p>
          <div className="space-y-4">
            <button onClick={() => handleLogin('Yudi')} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-lg shadow-blue-100 uppercase italic">Yudi Account</button>
            <button onClick={() => handleLogin('Salsa')} className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-lg shadow-orange-100 uppercase italic">Salsa Account</button>
          </div>
        </motion.div>
      </div>
    )
  }

  // --- 5. TAMPILAN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 text-gray-900 font-sans">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-b-[40px] shadow-lg mb-6">
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-lg"><User size={28} /></div>
            <div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter">Halo, {userLogin}!</h1>
              <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest italic">Web Pro v5.4 (Online)</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-white/20 p-3 rounded-2xl active:bg-white/40 transition-all"><LogOut size={20}/></button>
        </div>
      </div>

      {/* NAVIGASI UTAMA */}
      <div className="px-6 grid grid-cols-3 gap-3 mb-8 text-center">
        <Link href="/chat"><div className="bg-white p-3 rounded-3xl shadow-sm border-b-4 border-blue-400 active:scale-95 transition-all"><div className="bg-blue-100 p-3 rounded-2xl mb-1 text-blue-600 inline-block"><MessageCircle size={20}/></div><span className="block text-[9px] font-black text-gray-500 uppercase">Chat</span></div></Link>
        <Link href="/game"><div className="bg-white p-3 rounded-3xl shadow-sm border-b-4 border-orange-400 active:scale-95 transition-all"><div className="bg-orange-100 p-3 rounded-2xl mb-1 text-orange-600 inline-block"><Gamepad2 size={20}/></div><span className="block text-[9px] font-black text-gray-500 uppercase">Game</span></div></Link>
        <button onClick={() => setIsAiOpen(true)} className="bg-white p-3 rounded-3xl shadow-sm border-b-4 border-purple-400 active:scale-95 transition-all"><div className="bg-purple-100 p-3 rounded-2xl mb-1 text-purple-600 inline-block"><Bot size={20}/></div><span className="block text-[9px] font-black text-gray-500 uppercase">AI Search</span></button>
      </div>

      <div className="px-6 space-y-6">
        
        {/* FITUR ADMIN TRANSAKSI (BARU) */}
        <section className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4 font-black text-gray-800 uppercase text-xs italic"><Wallet className="text-purple-500" size={18}/> Admin Transaksi</div>
           <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Admin Dana</label>
                <input type="number" value={adminData.dana} onChange={(e) => setAdminData({...adminData, dana: Number(e.target.value)})} className="w-full bg-purple-50 p-3 rounded-xl font-bold text-lg outline-none border border-purple-100 text-purple-600 text-center focus:border-purple-300" placeholder="0" />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Admin Chip</label>
                <input type="number" value={adminData.chip} onChange={(e) => setAdminData({...adminData, chip: Number(e.target.value)})} className="w-full bg-purple-50 p-3 rounded-xl font-bold text-lg outline-none border border-purple-100 text-purple-600 text-center focus:border-purple-300" placeholder="0" />
              </div>
           </div>
        </section>

        {/* FITUR CHIP DOMINO */}
        <section className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4 font-black text-gray-800 uppercase text-xs italic"><Coins className="text-orange-500" size={18}/> Chip Domino</div>
           <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Harga (1B)</label>
                <input type="number" value={chipData.hargaJual} onChange={(e) => setChipData({...chipData, hargaJual: Number(e.target.value)})} className="w-full bg-gray-50 p-3 rounded-xl font-bold text-sm outline-none border focus:border-orange-300" />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Chip Masuk</label>
                <input type="number" value={chipData.masuk} onChange={(e) => setChipData({...chipData, masuk: Number(e.target.value)})} className="w-full bg-green-50 p-3 rounded-xl font-bold text-sm outline-none border border-green-100 text-green-600" />
              </div>
           </div>
           <div>
              <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Chip Terjual</label>
              <input type="number" value={chipData.keluar} onChange={(e) => setChipData({...chipData, keluar: Number(e.target.value)})} className="w-full bg-orange-50 p-3 rounded-xl font-black text-lg outline-none border border-orange-100 text-orange-600 text-center" />
           </div>
        </section>

        {/* LIST VOUCHER STOK */}
        <section className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4 font-black text-gray-800 uppercase text-xs italic"><Package className="text-blue-500" size={18}/> Stok Voucher</div>
           {vocers.map((v, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase mb-1"><span>{v.nama}</span><span>Rp {(hitungStok(v.rumus)*v.harga).toLocaleString()}</span></div>
                <div className="flex gap-2">
                  <input type="text" value={v.rumus} onChange={(e) => {
                    const n = [...vocers]; n[i].rumus = e.target.value; setVocers(n);
                  }} className="flex-1 bg-gray-50 p-3 rounded-xl font-bold text-sm outline-none border focus:border-blue-300" placeholder="Stok (Rumus)" />
                  <input type="number" value={v.harga} onChange={(e) => {
                    const n = [...vocers]; n[i].harga = Number(e.target.value); setVocers(n);
                  }} className="w-24 bg-blue-50 p-3 rounded-xl font-black text-xs outline-none text-blue-600 text-center" />
                </div>
              </div>
           ))}
        </section>

        {/* TOTAL REKAP */}
        <div className="bg-white p-6 rounded-[35px] shadow-xl border-b-8 border-blue-500 text-center">
          <p className="text-gray-400 text-[9px] font-black uppercase mb-1 tracking-widest">Total Pendapatan Hari Ini</p>
          <p className="text-3xl font-black text-gray-900 italic tracking-tighter">Rp {totalSemua.toLocaleString()}</p>
        </div>
      </div>

      {/* FLOAT BUTTON CALCULATOR */}
      <button onClick={() => setIsCalcOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 rounded-full shadow-2xl flex items-center justify-center text-white z-40 border-4 border-white active:scale-90 transition-all shadow-orange-300"><Calculator size={24} /></button>

      {/* MODAL AI GEMINI */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 bg-white z-[60] flex flex-col">
            <div className="p-4 bg-purple-600 text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2 font-black italic text-xs uppercase"><Bot size={20}/> AI Assistant</div>
              <button onClick={() => setIsAiOpen(false)} className="p-2 bg-white/20 rounded-full active:bg-white/40"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {aiResponse ? (
                <div className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-200 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap font-medium">
                  {aiResponse}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Bot size={80} className="mb-4 text-purple-600"/>
                  <p className="text-[10px] font-black uppercase italic tracking-widest">Siap melayani pertanyaanmu...</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t flex gap-2 items-center">
              <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && tanyaGemini()} placeholder="Ketik pesan di sini..." className="flex-1 bg-gray-100 p-4 rounded-2xl outline-none text-sm font-bold border focus:border-purple-400" />
              <button onClick={tanyaGemini} disabled={isLoadingAi} className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center active:scale-90 disabled:opacity-50">
                {isLoadingAi ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL KALKULATOR PORTABLE */}
      <AnimatePresence>
        {isCalcOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end">
             <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="w-full bg-white rounded-t-[40px] p-6 shadow-2xl max-h-[90vh]">
               <div className="flex justify-between items-center mb-4 text-gray-400 font-black text-[10px] uppercase">
                 <div className="flex items-center gap-2 font-bold"><History size={14}/> History</div>
                 <button onClick={() => setIsCalcOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
               </div>
               
               <div className="bg-gray-50 p-3 rounded-2xl mb-4 max-h-24 overflow-y-auto border border-dashed text-[10px] font-bold text-gray-400">
                {calcHistory.length > 0 ? calcHistory.map((h, i) => <div key={i} className="border-b pb-1 mb-1">{h}</div>) : "No History"}
               </div>

               <div className="bg-gray-900 p-6 rounded-3xl mb-6 text-right text-4xl font-black text-orange-400 break-all shadow-inner">{calcInput || '0'}</div>
               
               <div className="grid grid-cols-4 gap-2">
                 {['7','8','9','/','4','5','6','*','1','2','3','-','0','C','=','+'].map((char) => (
                   <button key={char} onClick={() => {
                     if (char === '=') calculateResult()
                     else if (char === 'C') setCalcInput('')
                     else setCalcInput(p => p + char)
                   }} className={`p-5 rounded-2xl font-black text-xl active:scale-90 transition-all ${char === '=' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-800'}`}>{char}</button>
                 ))}
                 <button onClick={() => { setCalcHistory([]); localStorage.removeItem('calcHistory'); }} className="col-span-4 p-3 mt-2 text-[10px] font-black uppercase text-red-500 flex items-center justify-center gap-1"><Trash2 size={12}/> Clear History</button>
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
