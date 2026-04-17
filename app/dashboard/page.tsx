"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Gamepad2, TrendingUp, Wallet, Package, Coins, User } from 'lucide-react'
import Link from 'next/link'

export default function DashboardSalsa() {
  const [userLogin, setUserLogin] = useState('Salsa') // Default

  // Ambil data siapa yang login dari penyimpanan HP
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfil')
    if (savedUser) setUserLogin(savedUser)
  }, [])

  const [vocers, setVocers] = useState([
    { nama: 'Axis 3gb', awal: 23, sisa: 18, harga: 15000 },
    { nama: 'Tri 4gb', awal: 19, sisa: 13, harga: 15000 },
    { nama: 'Xl 3gb', awal: 8, sisa: 5, harga: 5000 },
  ])

  const updateStok = (index: number, field: 'awal' | 'sisa' | 'harga', val: string) => {
    const newVocers = [...vocers]
    // @ts-ignore
    newVocers[index][field] = Number(val)
    setVocers(newVocers)
  }

  const totalPenjualanVocer = vocers.reduce((acc, v) => acc + ((v.awal - v.sisa) * v.harga), 0)

  return (
    <div className="min-h-screen bg-[#F0F9FF] pb-24 text-gray-900">
      {/* HEADER DENGAN NAMA PROFIL */}
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-b-[40px] shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-lg">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-white text-xl font-black italic uppercase italic">Halo, {userLogin}!</h1>
              <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest">Web Bersama v2.0</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white border border-white/30">
            <TrendingUp size={20} />
          </div>
        </div>
      </motion.div>

      {/* NAVIGASI */}
      <div className="px-6 -mt-6 grid grid-cols-2 gap-4">
        <Link href="/chat">
          <motion.div whileTap={{ scale: 0.95 }} className="bg-white p-4 rounded-3xl shadow-xl flex flex-col items-center border-b-4 border-blue-400">
            <div className="bg-blue-100 p-3 rounded-2xl mb-2 text-blue-600"><MessageCircle /></div>
            <span className="text-[10px] font-black text-gray-500 uppercase">Chat Kita</span>
          </motion.div>
        </Link>
        <Link href="/game">
          <motion.div whileTap={{ scale: 0.95 }} className="bg-white p-4 rounded-3xl shadow-xl flex flex-col items-center border-b-4 border-orange-400">
            <div className="bg-orange-100 p-3 rounded-2xl mb-2 text-orange-600"><Gamepad2 /></div>
            <span className="text-[10px] font-black text-gray-500 uppercase">Game Dino</span>
          </motion.div>
        </Link>
      </div>

      <div className="p-6 space-y-6">
        {/* ALAT HITUNG VOCER + PERKALIAN */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-blue-500" size={20} />
            <h2 className="font-black text-gray-800 tracking-tight">HITUNG PENJUALAN</h2>
          </div>
          
          <div className="space-y-4">
            {vocers.map((v, i) => (
              <div key={i} className="bg-white p-4 rounded-[30px] shadow-md border border-gray-100">
                <input type="text" value={v.nama} className="text-[11px] font-black text-gray-800 uppercase mb-3 w-full bg-gray-50 p-2 rounded-xl border-none outline-none" />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                    <input type="number" value={v.awal} onChange={(e) => updateStok(i, 'awal', e.target.value)} className="w-10 h-10 text-gray-900 font-bold text-center bg-transparent outline-none" />
                    <span className="text-gray-300">-</span>
                    <input type="number" value={v.sisa} onChange={(e) => updateStok(i, 'sisa', e.target.value)} className="w-10 h-10 text-gray-900 font-bold text-center bg-transparent outline-none" />
                  </div>
                  <span className="font-bold text-gray-400">x</span>
                  <div className="flex-1 bg-blue-50 p-2 rounded-2xl border border-blue-100 flex items-center">
                    <span className="text-[10px] font-bold text-blue-400 mr-1">Rp</span>
                    <input type="number" value={v.harga} onChange={(e) => updateStok(i, 'harga', e.target.value)} className="w-full bg-transparent text-gray-900 font-bold outline-none" />
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-dashed border-gray-100 flex justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Subtotal:</span>
                  <span className="text-sm font-black text-orange-600">Rp {((v.awal - v.sisa) * v.harga).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TOTAL AKHIR */}
        <div className="bg-gray-900 p-6 rounded-[35px] shadow-2xl">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1 text-center">Total Pendapatan Vocer</p>
          <p className="text-3xl font-black text-orange-400 text-center tracking-tighter">Rp {totalPenjualanVocer.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
