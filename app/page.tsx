"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserHeart, UserCheck, Lock } from 'lucide-react'

export default function LoginPage() {
  const [pass, setPass] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)

  // FUNGSI POIN 3: Menyimpan Nama ke Memori HP
  const masukSebagai = (nama: string) => {
    localStorage.setItem('userProfil', nama) // Simpan nama
    window.location.href = '/dashboard' // Pindah ke Dashboard
  }

  // Cek Password Utama (30102007)
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
        
        {/* Dekorasi Background */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full opacity-50"></div>
        
        {!isUnlocked ? (
          /* TAMPILAN 1: MASUKKAN PASSWORD */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Lock className="text-orange-500" size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tighter">Web Bersama</h1>
            <p className="text-gray-400 text-xs font-bold mb-8 uppercase tracking-widest">Masukkan Kode Rahasia</p>
            
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Ketik di sini..."
              className="w-full p-5 bg-gray-50 rounded-2xl mb-4 border-2 border-transparent focus:border-orange-400 focus:bg-white outline-none text-center font-black text-gray-800 transition-all"
            />
            
            <button 
              onClick={cekPassword}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white p-5 rounded-2xl font-black shadow-lg shadow-orange-300 transition-all active:scale-95"
            >
              BUKA AKSES
            </button>
          </motion.div>
        ) : (
          /* TAMPILAN 2: PILIH PROFIL (LOGIKA POIN 3) */
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 text-center">
            <h2 className="text-xl font-black text-gray-800 mb-1 uppercase italic">Siapa Ini?</h2>
            <p className="text-gray-400 text-[10px] font-bold mb-8 uppercase tracking-[0.3em]">Pilih profil kamu dulu ya</p>
            
            <div className="grid gap-4">
              {/* TOMBOL SALSA */}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => masukSebagai('Salsa')}
                className="group flex items-center gap-4 p-4 bg-orange-50 hover:bg-orange-100 rounded-3xl border-2 border-orange-100 transition-all"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-md group-hover:rotate-6 transition-transform">
                  <UserHeart size={30} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Gadis Cantik</p>
                  <p className="text-lg font-black text-gray-800">SALSA</p>
                </div>
              </motion.button>

              {/* TOMBOL YUDI */}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => masukSebagai('Yudi')}
                className="group flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-3xl border-2 border-blue-100 transition-all"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-md group-hover:-rotate-6 transition-transform">
                  <UserCheck size={30} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Cowok Ganteng</p>
                  <p className="text-lg font-black text-gray-800">YUDI</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
