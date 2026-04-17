"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, MessageCircle, Gamepad2, TrendingUp, Wallet, Package, Coins } from 'lucide-react'
import Link from 'next/link'

export default function DashboardSalsa() {
  // --- STATE VOCER ---
  const [vocers, setVocers] = useState([
    { nama: 'Axis 3gb', awal: 23, sisa: 18, harga: 15000 },
    { nama: 'Tri 4gb', awal: 19, sisa: 13, harga: 15000 },
    { nama: 'Xl 3gb', awal: 8, sisa: 5, harga: 5000 },
    { nama: 'Axis 10+3', awal: 10, sisa: 8, harga: 20000 },
    { nama: 'Smartfren 3gb', awal: 5, sisa: 4, harga: 15000 },
  ])

  // --- STATE CHIP (Bisa diisi manual oleh Salsa) ---
  const [chip, setChip] = useState({ 
    modal: 26.9, 
    sisa: 6.6, 
    hargaJual: 1015 // Angka cash yang kamu berikan
  })

  // --- STATE DANA ---
  const [dana, setDana] = useState({ sisa: 1973, cash: 803, adm: 141 })

  // Fungsi Update
  const updateStok = (index: number, field: 'awal' | 'sisa', val: string) => {
    const newVocers = [...vocers]
    newVocers[index][field] = Number(val)
    setVocers(newVocers)
  }

  const updateNama = (index: number, val: string) => {
    const newVocers = [...vocers]
    newVocers[index].nama = val
    setVocers(newVocers)
  }

  // Hitung Otomatis
  const totalPenjualanVocer = vocers.reduce((acc, v) => acc + ((v.awal - v.sisa) * v.harga), 0)
  
  // Hitung Chip (Sesuai rumusmu: Modal - Penggunaan)
  const chipTerpakai = (chip.modal - chip.sisa).toFixed(1)
  const untungChip = chip.hargaJual - (Number(chipTerpakai) * 10) // Contoh logika admin

  return (
    <div className="min-h-screen bg-[#F0F9FF] pb-24 text-gray-900">
      {/* HEADER */}
      <motion.div 
        initial={{ y: -50 }} animate={{ y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-b-[40px] shadow-lg"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-black italic uppercase tracking-tighter">Web Bersama</h1>
            <p className="text-orange-100 text-[10px] font-bold uppercase tracking-[0.2em]">Yudi & Salsa Project</p>
          </div>
          <div className="w-12 h-12 bg-white/30 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner">
            <TrendingUp className="text-white" />
          </div>
        </div>
      </motion.div>

      {/* NAVIGASI */}
      <div className="px-6 -mt-6 grid grid-cols-2 gap-4">
        <Link href="/chat">
          <motion.div whileTap={{ scale: 0.9 }} className="bg-white p-4 rounded-3xl shadow-lg flex flex-col items-center border-b-4 border-blue-400">
            <div className="bg-blue-100 p-3 rounded-2xl mb-2 text-blue-600"><MessageCircle /></div>
            <span className="text-[10px] font-black text-gray-600 uppercase">Chat Kita</span>
          </motion.div>
        </Link>
        <Link href="/game">
          <motion.div whileTap={{ scale: 0.9 }} className="bg-white p-4 rounded-3xl shadow-lg flex flex-col items-center border-b-4 border-orange-400">
            <div className="bg-orange-100 p-3 rounded-2xl mb-2 text-orange-600"><Gamepad2 /></div>
            <span className="text-[10px] font-black text-gray-600 uppercase">Game Dino</span>
          </motion.div>
        </Link>
      </div>

      <div className="p-6 space-y-8">
        {/* BAGIAN HITUNG CHIP (BARU) */}
        <section className="bg-white p-6 rounded-[35px] shadow-xl border-t-8 border-orange-500">
          <div className="flex items-center gap-2 mb-6">
            <Coins className="text-orange-500" />
            <h2 className="font-black text-gray-800 tracking-tight">KALKULATOR CHIP</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Modal Awal</label>
              <input 
                type="number" 
                value={chip.modal} 
                onChange={(e) => setChip({...chip, modal: Number(e.target.value)})}
                className="w-full p-4 bg-orange-50 text-gray-900 font-black rounded-2xl border border-orange-100 focus:bg-white focus:border-orange-400 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Sisa Chip</label>
              <input 
                type="number" 
                value={chip.sisa} 
                onChange={(e) => setChip({...chip, sisa: Number(e.target.value)})}
                className="w-full p-4 bg-blue-50 text-gray-900 font-black rounded-2xl border border-blue-100 focus:bg-white focus:border-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Chip Terpakai</p>
            <p className="text-2xl font-black text-orange-600 tracking-tighter">{chipTerpakai} Chip</p>
          </div>
        </section>

        {/* BAGIAN STOK VOCER */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-blue-500" size={20} />
            <h2 className="font-black text-gray-800 tracking-tight">STOK VOCER</h2>
          </div>
          
          <div className="space-y-3">
            {vocers.map((v, i) => (
              <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="bg-white p-4 rounded-3xl shadow-md border border-gray-50 flex items-center justify-between gap-3"
              >
                <div className="w-1/2">
                  <input 
                    type="text" 
                    value={v.nama} 
                    onChange={(e) => updateNama(i, e.target.value)}
                    className="text-[11px] font-black text-gray-900 uppercase w-full bg-gray-50 p-2 rounded-xl outline-none border border-transparent focus:border-orange-300 focus:bg-white"
                  />
                </div>
                <div className="flex items-center gap-1 w-1/2 justify-end">
                  <input type="number" value={v.awal} onChange={(e) => updateStok(i, 'awal', e.target.value)} className="w-10 p-2 bg-blue-50 text-gray-900 font-black rounded-xl text-center text-xs outline-none border border-blue-100" />
                  <span className="text-gray-300 font-bold">-</span>
                  <input type="number" value={v.sisa} onChange={(e) => updateStok(i, 'sisa', e.target.value)} className="w-10 p-2 bg-orange-50 text-gray-900 font-black rounded-xl text-center text-xs outline-none border border-orange-100" />
                  <span className="text-blue-600 font-black ml-1">= {v.awal - v.sisa}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* RINGKASAN AKHIR */}
        <section className="bg-gray-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Laporan Penjualan</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/60 text-[9px] font-bold uppercase mb-1">Total Vocer</p>
                <p className="text-2xl font-black text-orange-400">Rp {totalPenjualanVocer.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-[9px] font-bold uppercase mb-1">Chip Terpakai</p>
                <p className="text-2xl font-black text-blue-400">{chipTerpakai}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

