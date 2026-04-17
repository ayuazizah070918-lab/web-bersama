"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Gamepad2, TrendingUp, Wallet, Package, User, Calculator, X } from 'lucide-react'
import Link from 'next/link'

export default function DashboardSalsa() {
  const [userLogin, setUserLogin] = useState('Salsa')
  const [isCalcOpen, setIsCalcOpen] = useState(false)
  const [calcInput, setCalcInput] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfil')
    if (savedUser) setUserLogin(savedUser)
  }, [])

  // DAFTAR VOUCHER LENGKAP
  const [vocers, setVocers] = useState([
    { nama: 'Axis 3GB', awal: 0, sisa: 0, harga: 15000 },
    { nama: 'Axis 5GB', awal: 0, sisa: 0, harga: 20000 },
    { nama: 'Tri 4GB', awal: 0, sisa: 0, harga: 15000 },
    { nama: 'Tri 6GB', awal: 0, sisa: 0, harga: 25000 },
    { nama: 'XL 3GB', awal: 0, sisa: 0, harga: 5000 },
    { nama: 'Smartfren 6GB', awal: 0, sisa: 0, harga: 20000 },
    { nama: 'T-Sel 5GB', awal: 0, sisa: 0, harga: 30000 },
  ])

  // HITUNGAN CHIP (KEMBALI LAGI)
  const [chip, setChip] = useState({ harga: 65000, jumlah: 0 })

  const updateStok = (index: number, field: string, val: string) => {
    const newVocers = [...vocers]
    // @ts-ignore
    newVocers[index][field] = Number(val)
    setVocers(newVocers)
  }

  const totalVocer = vocers.reduce((acc, v) => acc + ((v.awal - v.sisa) * v.harga), 0)
  const totalChip = chip.jumlah * chip.harga
  const totalSemua = totalVocer + totalChip

  // Fungsi Kalkulator Portable
  const addToCalc = (val: string) => setCalcInput(prev => prev + val)
  const calculateResult = () => {
    try { setCalcInput(eval(calcInput).toString()) } 
    catch { setCalcInput('Error') }
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] pb-32 text-gray-900 font-sans">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-b-[40px] shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-lg"><User size={28} /></div>
            <div>
              <h1 className="text-white text-xl font-black italic uppercase">Halo, {userLogin}!</h1>
              <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest">Web Bersama v2.5</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white border border-white/30"><TrendingUp size={20} /></div>
        </div>
      </div>

      {/* NAVIGASI */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-8">
        <Link href="/chat">
          <div className="bg-white p-4 rounded-3xl shadow-xl flex flex-col items-center border-b-4 border-blue-400">
            <div className="bg-blue-100 p-3 rounded-2xl mb-2 text-blue-600"><MessageCircle /></div>
            <span className="text-[10px] font-black text-gray-500 uppercase">Chat Kita</span>
          </div>
        </Link>
        <Link href="/game">
          <div className="bg-white p-4 rounded-3xl shadow-xl flex flex-col items-center border-b-4 border-orange-400">
            <div className="bg-orange-100 p-3 rounded-2xl mb-2 text-orange-600"><Gamepad2 /></div>
            <span className="text-[10px] font-black text-gray-500 uppercase">Game Dino</span>
          </div>
        </Link>
      </div>

      <div className="px-6 space-y-8">
        {/* ALAT HITUNG VOUCHER */}
        <section>
          <div className="flex items-center gap-2 mb-4 font-black text-gray-800"><Package className="text-blue-500" size={20}/> DATA VOUCHER</div>
          <div className="space-y-4">
            {vocers.map((v, i) => (
              <div key={i} className="bg-white p-4 rounded-[30px] shadow-md border border-gray-100 transition-all focus-within:ring-2 focus-within:ring-orange-300">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">{v.nama}</p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border">
                    <input type="number" placeholder="0" onChange={(e) => updateStok(i, 'awal', e.target.value)} className="w-10 h-10 text-center font-bold bg-transparent outline-none" />
                    <span className="text-gray-300">-</span>
                    <input type="number" placeholder="0" onChange={(e) => updateStok(i, 'sisa', e.target.value)} className="w-10 h-10 text-center font-bold bg-transparent outline-none" />
                  </div>
                  <div className="flex-1 bg-blue-50 p-2 rounded-2xl border border-blue-100 flex items-center">
                    <span className="text-[10px] font-bold text-blue-400 mr-1">Rp</span>
                    <input type="number" value={v.harga} onChange={(e) => updateStok(i, 'harga', e.target.value)} className="w-full bg-transparent font-bold outline-none" />
                  </div>
                </div>
                <div className="mt-2 text-right text-[11px] font-black text-orange-500 italic">Sub: Rp {((v.awal-v.sisa)*v.harga).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HITUNGAN CHIP */}
        <section className="bg-gray-900 p-6 rounded-[35px] shadow-2xl relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-orange-400 font-black tracking-widest text-[10px]"><Wallet size={16}/> SETORAN CHIP MD</div>
              <div className="flex gap-4 items-center mb-4">
                <input type="number" placeholder="Jumlah B" onChange={(e) => setChip({...chip, jumlah: Number(e.target.value)})} className="flex-1 bg-white/10 p-4 rounded-2xl text-white font-bold outline-none border border-white/20" />
                <div className="flex-1 bg-white/10 p-4 rounded-2xl text-white font-bold border border-white/20 text-center text-xs">@65K</div>
              </div>
              <div className="text-right font-black text-white text-xl italic text-orange-400">Rp {totalChip.toLocaleString()}</div>
           </div>
        </section>

        {/* TOTAL SEMUA */}
        <div className="bg-white p-6 rounded-[35px] shadow-xl border-t-8 border-orange-500 text-center mb-10">
          <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Total Pendapatan (Vocer + Chip)</p>
          <p className="text-3xl font-black text-gray-900 italic tracking-tighter">Rp {totalSemua.toLocaleString()}</p>
        </div>
      </div>

      {/* TOMBOL KALKULATOR PORTABLE (FLOATING) */}
      <motion.button whileTap={{ scale: 0.8 }} onClick={() => setIsCalcOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-orange-500 rounded-full shadow-2xl flex items-center justify-center text-white z-40 border-4 border-white">
        <Calculator size={28} />
      </motion.button>

      {/* POPUP KALKULATOR */}
      <AnimatePresence>
        {isCalcOpen && (
          <motion.div initial={{ y: 500 }} animate={{ y: 0 }} exit={{ y: 500 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
            <div className="w-full bg-white rounded-t-[40px] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black uppercase text-gray-400 text-xs tracking-widest">Kalkulator Cepat</h3>
                <button onClick={() => setIsCalcOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
              </div>
              <div className="bg-gray-100 p-6 rounded-3xl mb-6 text-right text-3xl font-black text-gray-800 overflow-hidden">{calcInput || '0'}</div>
              <div className="grid grid-cols-4 gap-3">
                {['7','8','9','/','4','5','6','*','1','2','3','-','0','C','=','+'].map((char) => (
                  <button key={char} onClick={() => char === '=' ? calculateResult() : char === 'C' ? setCalcInput('') : addToCalc(char)} className={`p-5 rounded-2xl font-black text-lg ${char === '=' ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-800'}`}>
                    {char}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
