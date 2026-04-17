"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, Heart } from 'lucide-react'

export default function LoginPage() {
  const [pass, setPass] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)

  const masukSebagai = (nama: string) => {
    localStorage.setItem('userProfil', nama)
    window.location.href = '/dashboard'
  }

  const cekPassword = () => {
    if (pass === '30102007') {
      setIsUnlocked(true)
    } else {
      alert('Password Salah, Sayang! Coba ingat tanggal kita.')
    }
  }

  return (
    <div className="h-[100dvh] bg-gradient-to-b from-orange-400 to-orange-600 flex items-center justify-center p-6 overflow-hidden font-sans">
      <div className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl p-8 relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full opacity-50"></div>
        
        {!isUnlocked ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Lock className="text-orange-500" size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tighter">Web Bersama</h1>
            <p className="text-gray-400 text-xs font-bold mb-8 uppercase tracking-widest">Masukkan Kode Rahasia</p>
            
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Ketik di sini..."
              className="w-full p-5 bg-gray-50 rounded-2xl mb-4 border-2 border-transparent focus:border-orange-400 focus:bg-white outline-none text-center font-black text-gray-800"
            />
            
            <button 
              onClick={cekPassword}
              className="w-full bg-orange-500 text-white p-5 rounded-2xl font-black shadow-lg shadow-orange-300 active:scale-95 transition-all"
            >
              BUKA AKSES
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 text-center">
            <h2 className="text-xl font-black text-gray-800 mb-1 uppercase italic">Siapa Ini?</h2>
            <p className="text-gray-400 text-[10px] font-bold mb-8 uppercase tracking-[0.3em]">Pilih profil kamu dulu ya</p>
            
            <div className="grid gap-4">
              {/* TOMBOL SALSA */}
              <button 
                onClick={() => masukSebagai('Salsa')}
                className="flex items-center gap-4 p-4 bg-orange-50 rounded-3xl border-2 border-orange-100 w-full"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-md">
                  <Heart size={30} fill="currentColor" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Gadis Cantik</p>
                  <p className="text-lg font-black text-gray-800">SALSA</p>
                </div>
              </button>

              {/* TOMBOL YUDI */}
              <button 
                onClick={() => masukSebagai('Yudi')}
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-3xl border-2 border-blue-100 w-full"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-md">
                  <User size={30} fill="currentColor" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Cowok Ganteng</p>
                  <p className="text-lg font-black text-gray-800">YUDI</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
