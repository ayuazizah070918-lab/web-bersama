"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Gamepad2, User, Calculator, X, History, Trash2, Bot, Send, Loader2, Coins, Package, LogOut, Wallet } from 'lucide-react'
import Link from 'next/link'

const defaultChip = { hargaJual: 65000, masuk: 0, keluar: 0 }
const defaultAdmin = { dana: 0, chip: 0 }
const defaultVocers = [
  { nama: 'Axis 3GB', rumus: '0', harga: 15000 },
  { nama: 'Axis 5GB', rumus: '0', harga: 20000 },
  { nama: 'Tri 4GB', rumus: '0', harga: 15000 },
  { nama: 'XL 3GB', rumus: '0', harga: 5000 },
  { nama: 'Smartfren', rumus: '0', harga: 20000 },
  { nama: 'T-Sel', rumus: '0', harga: 30000 },
]

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userLogin, setUserLogin] = useState('')
  const [isCalcOpen, setIsCalcOpen] = useState(false)
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [calcInput, setCalcInput] = useState('')
  const [calcHistory, setCalcHistory] = useState<string[]>([])
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiChatHistory, setAiChatHistory] = useState<{ role: string, text: string }[]>([])
  const [isLoadingAi, setIsLoadingAi] = useState(false)
  
  const [chipData, setChipData] = useState(defaultChip)
  const [adminData, setAdminData] = useState(defaultAdmin)
  const [vocers, setVocers] = useState(defaultVocers)

  // Efek Transisi Khas iOS (Spring)
  const iosTransition = { type: "spring", stiffness: 300, damping: 30 };

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfil')
    if (savedUser) { setUserLogin(savedUser); setIsLoggedIn(true); }
    
    // Load semua data permanen
    setCalcHistory(JSON.parse(localStorage.getItem('calcHistory') || '[]'))
    setChipData(JSON.parse(localStorage.getItem('chipDataStorage') || JSON.stringify(defaultChip)))
    setAdminData(JSON.parse(localStorage.getItem('adminDataStorage') || JSON.stringify(defaultAdmin)))
    setVocers(JSON.parse(localStorage.getItem('vocersDataStorage') || JSON.stringify(defaultVocers)))
    setAiChatHistory(JSON.parse(localStorage.getItem('aiChatHistory') || '[]'))
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('chipDataStorage', JSON.stringify(chipData))
      localStorage.setItem('adminDataStorage', JSON.stringify(adminData))
      localStorage.setItem('vocersDataStorage', JSON.stringify(vocers))
      localStorage.setItem('aiChatHistory', JSON.stringify(aiChatHistory))
    }
  }, [chipData, adminData, vocers, aiChatHistory, isLoggedIn])

  const resetSemuaHitungan = () => {
    if (confirm('Bersihkan semua data hitungan hari ini?')) {
      setChipData(defaultChip); setAdminData(defaultAdmin); setVocers(defaultVocers);
    }
  }

  const hitungStok = (rumus: string) => {
    try { return eval(rumus.replace(/[^-+*/0-9.]/g, '')) || 0 } catch { return 0 }
  }

  const totalSemua = vocers.reduce((acc, v) => acc + (hitungStok(v.rumus) * v.harga), 0) + (chipData.keluar * chipData.hargaJual) + adminData.dana + adminData.chip

  const tanyaGemini = async () => {
    if (!aiPrompt.trim()) return
    const userMsg = { role: 'user', text: aiPrompt }
    setAiChatHistory(prev => [...prev, userMsg])
    setAiPrompt('')
    setIsLoadingAi(true)
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }] }] })
      })
      const data = await response.json()
      const aiMsg = { role: 'ai', text: data.candidates[0].content.parts[0].text }
      setAiChatHistory(prev => [...prev, aiMsg])
    } catch (error) {
      setAiChatHistory(prev => [...prev, { role: 'ai', text: "Koneksi terputus. Coba lagi nanti." }])
    } finally { setIsLoadingAi(false) }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={iosTransition} className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg shadow-orange-200"><User size={40} /></div>
          <h2 className="text-2xl font-black text-gray-800 mb-2 italic tracking-tight">LOGIN DASHBOARD</h2>
          <p className="text-gray-400 text-[10px] font-bold mb-8 uppercase tracking-[0.2em]">Premium Web-App v5.6</p>
          <div className="space-y-4">
            {['Yudi', 'Salsa'].map(name => (
              <button key={name} onClick={() => handleLogin(name)} className={`w-full py-5 rounded-2xl font-black text-lg active:scale-[0.97] transition-all shadow-md uppercase italic ${name === 'Yudi' ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>{name} Account</button>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#F2F4F7] pb-32 text-gray-900 font-sans">
      {/* iOS STYLE HEADER */}
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100"><User size={20} /></div>
          <div>
            <h1 className="text-sm font-black italic uppercase tracking-tight">Halo, {userLogin}</h1>
            <div className="flex items-center gap-1 text-green-500 font-bold text-[9px] uppercase"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Systems Active</div>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-gray-100 p-2.5 rounded-full text-gray-500 active:scale-90 transition-all"><LogOut size={18}/></button>
      </div>

      <div className="px-6 py-8 grid grid-cols-3 gap-3 text-center">
        <Link href="/chat"><div className="bg-white p-4 rounded-[28px] shadow-sm active:scale-90 transition-all border border-gray-100"><MessageCircle className="text-blue-500 mx-auto mb-1" size={24}/><span className="text-[9px] font-black uppercase text-gray-400">Chat</span></div></Link>
        <Link href="/game"><div className="bg-white p-4 rounded-[28px] shadow-sm active:scale-90 transition-all border border-gray-100"><Gamepad2 className="text-orange-500 mx-auto mb-1" size={24}/><span className="text-[9px] font-black uppercase text-gray-400">Play</span></div></Link>
        <button onClick={() => setIsAiOpen(true)} className="bg-white p-4 rounded-[28px] shadow-sm active:scale-90 transition-all border border-gray-100"><Bot className="text-purple-500 mx-auto mb-1" size={24}/><span className="text-[9px] font-black uppercase text-gray-400">Ask AI</span></button>
      </div>

      <div className="px-6 space-y-5">
        {/* SEMUA INPUT KASIR (ADMIN, CHIP, VOUCHER) TETAP SAMA NAMUN DENGAN UI LEBIH CLEAN */}
        <section className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4 font-black text-gray-800 uppercase text-[10px] tracking-widest"><Wallet className="text-purple-500" size={16}/> Admin Transaksi</div>
           <div className="grid grid-cols-2 gap-3">
              <input type="number" value={adminData.dana || ''} onChange={(e) => setAdminData({...adminData, dana: Number(e.target.value)})} placeholder="Admin Dana" className="bg-gray-50 p-4 rounded-2xl font-bold text-center outline-none border border-transparent focus:border-purple-200 transition-all" />
              <input type="number" value={adminData.chip || ''} onChange={(e) => setAdminData({...adminData, chip: Number(e.target.value)})} placeholder="Admin Chip" className="bg-gray-50 p-4 rounded-2xl font-bold text-center outline-none border border-transparent focus:border-purple-200 transition-all" />
           </div>
        </section>

        <section className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4 font-black text-gray-800 uppercase text-[10px] tracking-widest"><Coins className="text-orange-500" size={16}/> Chip Domino</div>
           <div className="space-y-3">
              <div className="flex gap-2">
                <input type="number" value={chipData.hargaJual} onChange={(e) => setChipData({...chipData, hargaJual: Number(e.target.value)})} className="flex-1 bg-gray-50 p-4 rounded-2xl font-bold text-sm text-center" />
                <input type="number" value={chipData.masuk || ''} onChange={(e) => setChipData({...chipData, masuk: Number(e.target.value)})} placeholder="Masuk" className="w-24 bg-green-50 p-4 rounded-2xl font-bold text-sm text-green-600 text-center" />
              </div>
              <input type="number" value={chipData.keluar || ''} onChange={(e) => setChipData({...chipData, keluar: Number(e.target.value)})} placeholder="Banyak Chip Terjual" className="w-full bg-orange-50 p-5 rounded-2xl font-black text-xl text-orange-600 text-center outline-none" />
           </div>
        </section>

        <section className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4 font-black text-gray-800 uppercase text-[10px] tracking-widest"><Package className="text-blue-500" size={16}/> Voucher Stok</div>
           {vocers.map((v, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase mb-1 px-1"><span>{v.nama}</span><span>Rp {(hitungStok(v.rumus)*v.harga).toLocaleString()}</span></div>
                <div className="flex gap-2">
                  <input type="text" value={v.rumus} onChange={(e) => { const n = [...vocers]; n[i].rumus = e.target.value; setVocers(n); }} className="flex-1 bg-gray-50 p-4 rounded-2xl font-bold text-sm outline-none" placeholder="Rumus" />
                  <input type="number" value={v.harga} onChange={(e) => { const n = [...vocers]; n[i].harga = Number(e.target.value); setVocers(n); }} className="w-24 bg-blue-50 p-4 rounded-2xl font-black text-[11px] text-blue-600 text-center" />
                </div>
              </div>
           ))}
        </section>

        {/* TOTAL REKAP STICKY-LIKE */}
        <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-blue-100 border-b-8 border-blue-600 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Coins size={80}/></div>
          <button onClick={resetSemuaHitungan} className="absolute top-4 right-4 p-2.5 bg-red-50 text-red-500 rounded-full active:scale-75 transition-all"><Trash2 size={18}/></button>
          <div className="relative text-center">
            <p className="text-gray-400 text-[10px] font-black uppercase mb-2 tracking-[0.3em]">Net Earnings Today</p>
            <p className="text-4xl font-black text-gray-900 italic tracking-tighter">Rp {totalSemua.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* FLOAT BUTTON iOS STYLE */}
      <button onClick={() => setIsCalcOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-2xl flex items-center justify-center text-white z-40 border-4 border-white active:scale-90 transition-all"><Calculator size={28} /></button>

      {/* MODAL AI GEMINI (PERMANENT CHAT HISTORY) */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={iosTransition} className="fixed inset-0 bg-white z-[60] flex flex-col font-sans">
            <div className="p-5 border-b flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0">
              <div className="flex items-center gap-2"><Bot className="text-purple-600" size={24}/><span className="font-black italic text-xs uppercase">AI Assistant</span></div>
              <button onClick={() => setIsAiOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {aiChatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[24px] text-sm font-medium shadow-sm ${chat.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'}`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {isLoadingAi && <div className="flex justify-start"><div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"><Loader2 className="animate-spin text-purple-600" size={20}/></div></div>}
            </div>
            <div className="p-5 bg-white border-t flex gap-2">
              <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && tanyaGemini()} placeholder="Tanya sesuatu..." className="flex-1 bg-gray-100 p-4 rounded-2xl outline-none text-sm font-bold border-transparent focus:border-purple-300 transition-all" />
              <button onClick={tanyaGemini} disabled={isLoadingAi} className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center active:scale-90 disabled:opacity-50 shadow-lg shadow-purple-100"><Send size={20}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL KALKULATOR (SAMA DENGAN UI DIPERHALUS) */}
      <AnimatePresence>
        {isCalcOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end">
             <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={iosTransition} className="w-full bg-white rounded-t-[40px] p-8 shadow-2xl max-h-[90vh]">
               <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase"><History size={14}/> Calculator History</div>
                 <button onClick={() => setIsCalcOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
               </div>
               <div className="bg-gray-900 p-8 rounded-[32px] mb-6 text-right text-5xl font-black text-orange-400 shadow-inner overflow-hidden">{calcInput || '0'}</div>
               <div className="grid grid-cols-4 gap-3">
                 {['7','8','9','/','4','5','6','*','1','2','3','-','0','C','=','+'].map((char) => (
                   <button key={char} onClick={() => { if (char === '=') { try { setCalcInput(eval(calcInput).toString()) } catch { setCalcInput('Error') } } else if (char === 'C') setCalcInput(''); else setCalcInput(p => p + char); }} className={`p-6 rounded-[24px] font-black text-xl transition-all active:scale-[0.85] ${char === '=' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-800'}`}>{char}</button>
                 ))}
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
