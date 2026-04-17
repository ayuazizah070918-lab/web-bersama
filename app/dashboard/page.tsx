"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Gamepad2, Wallet, Package, User, Calculator, X, History, Trash2, Bot, Send, Loader2, Coins } from 'lucide-react'
import Link from 'next/link'

export default function DashboardSalsa() {
  const [userLogin, setUserLogin] = useState('Salsa')
  const [isCalcOpen, setIsCalcOpen] = useState(false)
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [calcInput, setCalcInput] = useState('')
  const [calcHistory, setCalcHistory] = useState<string[]>([])
  
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isLoadingAi, setIsLoadingAi] = useState(false)

  // FITUR CHIP YANG TADI HILANG SUDAH BALIK:
  const [chipData, setChipData] = useState({ hargaJual: 65000, masuk: 0, keluar: 0 })
  
  const [vocers, setVocers] = useState([
    { nama: 'Axis 3GB', rumus: '0', harga: 15000 },
    { nama: 'Axis 5GB', rumus: '0', harga: 20000 },
    { nama: 'Tri 4GB', rumus: '0', harga: 15000 },
    { nama: 'XL 3GB', rumus: '0', harga: 5000 },
    { nama: 'Smartfren', rumus: '0', harga: 20000 },
    { nama: 'T-Sel', rumus: '0', harga: 30000 },
  ])

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfil')
    const savedHistory = localStorage.getItem('calcHistory')
    if (savedUser) setUserLogin(savedUser)
    if (savedHistory) setCalcHistory(JSON.parse(savedHistory))
  }, [])

  const tanyaGemini = async () => {
    if (!aiPrompt.trim()) return
    setIsLoadingAi(true)
    setAiResponse('Sedang memproses...')

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey 
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: aiPrompt }] }]
        })
      })

      const data = await response.json()
      if (data.error) {
        setAiResponse(`Error: ${data.error.message}`)
      } else if (data.candidates) {
        setAiResponse(data.candidates[0].content.parts[0].text)
        setAiPrompt('')
      }
    } catch (error) {
      setAiResponse("Koneksi gagal. Cek internet kamu.")
    } finally {
      setIsLoadingAi(false)
    }
  }

  const hitungStok = (rumus: string) => {
    try { return eval(rumus.replace(/[^-+*/0-9.]/g, '')) || 0 } catch { return 0 }
  }

  const updateVocer = (index: number, field: string, val: string) => {
    const newVocers = [...vocers]
    // @ts-ignore
    newVocers[index][field] = field === 'harga' ? Number(val) : val
    setVocers(newVocers)
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

  const clearHistory = () => {
    setCalcHistory([])
    localStorage.removeItem('calcHistory')
  }

  // HITUNG TOTAL: (Voucher) + (Chip Keluar * Harga Jual)
  const totalSemua = vocers.reduce((acc, v) => acc + (hitungStok(v.rumus) * v.harga), 0) + (chipData.keluar * chipData.hargaJual)

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 text-gray-900 font-sans">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-b-[40px] shadow-lg mb-6">
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-lg"><User size={28} /></div>
            <div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter">Halo, {userLogin}!</h1>
              <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest tracking-tighter">Web Pro v5.3 (Chip Restored)</p>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGASI */}
      <div className="px-6 grid grid-cols-3 gap-3 mb-8 text-center">
        <Link href="/chat"><div className="bg-white p-3 rounded-3xl shadow-sm border-b-4 border-blue-400 active:scale-95 transition-all"><div className="bg-blue-100 p-3 rounded-2xl mb-1 text-blue-600 inline-block"><MessageCircle size={20}/></div><span className="block text-[9px] font-black text-gray-500 uppercase">Chat</span></div></Link>
        <Link href="/game"><div className="bg-white p-3 rounded-3xl shadow-sm border-b-4 border-orange-400 active:scale-95 transition-all"><div className="bg-orange-100 p-3 rounded-2xl mb-1 text-orange-600 inline-block"><Gamepad2 size={20}/></div><span className="block text-[9px] font-black text-gray-500 uppercase">Game</span></div></Link>
        <button onClick={() => setIsAiOpen(true)} className="bg-white p-3 rounded-3xl shadow-sm border-b-4 border-purple-400 active:scale-95 transition-all"><div className="bg-purple-100 p-3 rounded-2xl mb-1 text-purple-600 inline-block"><Bot size={20}/></div><span className="block text-[9px] font-black text-gray-500 uppercase">AI Search</span></button>
      </div>

      <div className="px-6 space-y-6">
        {/* FITUR CHIP (SUDAH KEMBALI) */}
        <section className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4 font-black text-gray-800 uppercase text-xs italic"><Coins className="text-orange-500" size={18}/> Chip Domino</div>
           <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Harga Jual (1B)</label>
                <input type="number" value={chipData.hargaJual} onChange={(e) => setChipData({...chipData, hargaJual: Number(e.target.value)})} className="w-full bg-gray-50 p-3 rounded-xl font-bold text-sm outline-none border focus:border-orange-300" />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Chip Masuk</label>
                <input type="number" value={chipData.masuk} onChange={(e) => setChipData({...chipData, masuk: Number(e.target.value)})} className="w-full bg-green-50 p-3 rounded-xl font-bold text-sm outline-none border border-green-100 focus:border-green-300 text-green-600" />
              </div>
           </div>
           <div>
              <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Chip Keluar (Terjual)</label>
              <input type="number" value={chipData.keluar} onChange={(e) => setChipData({...chipData, keluar: Number(e.target.value)})} className="w-full bg-orange-50 p-3 rounded-xl font-black text-lg outline-none border border-orange-100 focus:border-orange-300 text-orange-600 text-center" />
           </div>
        </section>

        {/* LIST VOUCHER */}
        <section className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4 font-black text-gray-800 uppercase text-xs italic"><Package className="text-blue-500" size={18}/> Stok Voucher</div>
           {vocers.map((v, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase mb-1"><span>{v.nama}</span><span>Rp {(hitungStok(v.rumus)*v.harga).toLocaleString()}</span></div>
                <div className="flex gap-2">
                  <input type="text" value={v.rumus} onChange={(e) => updateVocer(i, 'rumus', e.target.value)} className="flex-1 bg-gray-50 p-3 rounded-xl font-bold text-sm outline-none border focus:border-blue-300" placeholder="Stok" />
                  <input type="number" value={v.harga} onChange={(e) => updateVocer(i, 'harga', e.target.value)} className="w-24 bg-blue-50 p-3 rounded-xl font-black text-xs outline-none text-blue-600 text-center" />
                </div>
              </div>
           ))}
        </section>

        <div className="bg-white p-6 rounded-[35px] shadow-xl border-b-8 border-blue-500 text-center">
          <p className="text-gray-400 text-[9px] font-black uppercase mb-1">Total Pendapatan (Voucher + Chip)</p>
          <p className="text-3xl font-black text-gray-900 italic">Rp {totalSemua.toLocaleString()}</p>
        </div>
      </div>

      {/* FLOAT BUTTON CALCULATOR */}
      <button onClick={() => setIsCalcOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 rounded-full shadow-2xl flex items-center justify-center text-white z-40 border-4 border-white active:scale-90 transition-all"><Calculator size={24} /></button>

      {/* MODAL AI CHAT */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 bg-white z-[60] flex flex-col">
            <div className="p-4 bg-purple-600 text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2 font-black italic text-xs uppercase"><Bot size={20}/> Gemini Assistant</div>
              <button onClick={() => setIsAiOpen(false)} className="p-2 bg-white/20 rounded-full active:bg-white/40"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {aiResponse ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-200 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap font-medium">
                  {aiResponse}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Bot size={80} className="mb-4 text-purple-600"/>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 italic">Masukkan pertanyaan di bawah...</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t flex gap-2 items-center">
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && tanyaGemini()}
                placeholder="Tanya apa saja..." 
                className="flex-1 bg-gray-100 p-4 rounded-2xl outline-none text-sm font-bold border focus:border-purple-400 transition-all"
              />
              <button onClick={tanyaGemini} disabled={isLoadingAi} className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 disabled:opacity-50 transition-all">
                {isLoadingAi ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL KALKULATOR */}
      <AnimatePresence>
        {isCalcOpen && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end">
             <div className="w-full bg-white rounded-t-[40px] p-6 shadow-2xl max-h-[90vh]">
               <div className="flex justify-between items-center mb-4 text-gray-400 font-black text-[10px] uppercase">
                 <div className="flex items-center gap-2 font-bold uppercase"><History size={14}/> Riwayat</div>
                 <div className="flex gap-2">
                   <button onClick={clearHistory} className="p-2 bg-red-50 text-red-500 rounded-full"><Trash2 size={18}/></button>
                   <button onClick={() => setIsCalcOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                 </div>
               </div>
               <div className="bg-gray-50 p-3 rounded-2xl mb-4 space-y-1 max-h-24 overflow-y-auto border border-dashed text-[10px] font-bold">
                {calcHistory.length > 0 ? calcHistory.map((h, i) => (
                  <div key={i} className="flex justify-between text-gray-400 border-b border-gray-100 pb-1"><span>{h.split('=')[0]}</span><span className="text-blue-500 font-black">= {h.split('=')[1]}</span></div>
                )) : <p className="text-center text-gray-300 py-2 uppercase italic text-[9px]">Kosong</p>}
               </div>
               <div className="bg-gray-900 p-6 rounded-3xl mb-6 text-right text-3xl font-black text-orange-400 shadow-inner break-all">{calcInput || '0'}</div>
               <div className="grid grid-cols-4 gap-2">
                 {['7','8','9','/','4','5','6','*','1','2','3','-','0','C','=','+'].map((char) => (
                   <button key={char} onClick={() => char === '=' ? calculateResult() : char === 'C' ? setCalcInput('') : setCalcInput(prev => prev + char)} className={`p-5 rounded-2xl font-black text-xl active:scale-90 transition-all ${char === '=' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-800'}`}>{char}</button>
                 ))}
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
