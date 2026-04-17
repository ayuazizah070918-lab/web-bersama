"use client"
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Trophy, Gamepad2, RefreshCcw } from 'lucide-react'
import Link from 'next/link'

export default function GameDino() {
  const [isJumping, setIsJumping] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [cactusPos, setCactusPos] = useState(500)
  const [gameStarted, setGameStarted] = useState(false)
  
  // Fungsi Melompat
  const jump = () => {
    if (gameOver) return
    if (!gameStarted) {
      setGameStarted(true)
      return
    }
    if (!isJumping) {
      setIsJumping(true)
      setTimeout(() => setIsJumping(false), 500)
    }
  }

  // Logika Gerakan Kaktus & Tabrakan
  useEffect(() => {
    if (gameOver || !gameStarted) return

    const gameLoop = setInterval(() => {
      setCactusPos((pos) => {
        if (pos <= -30) {
          setScore(s => s + 1)
          return 400 // Kaktus muncul lagi dari kanan
        }
        // Semakin tinggi skor, kaktus semakin cepat (Max kecepatan 15)
        const speed = Math.min(8 + Math.floor(score / 5), 15)
        return pos - speed 
      })

      // Deteksi Tabrakan (Dino di koordinat tertentu)
      // Dino lebar 48px, kaktus lebar 32px
      if (cactusPos > 20 && cactusPos < 60 && !isJumping) {
        setGameOver(true)
      }
    }, 20)

    return () => clearInterval(gameLoop)
  }, [cactusPos, isJumping, gameOver, gameStarted, score])

  return (
    <div 
      className="h-[100dvh] w-full max-w-md mx-auto bg-white flex flex-col overflow-hidden select-none shadow-2xl relative"
      onClick={jump}
    >
      {/* HEADER ATAS */}
      <div className="p-4 flex items-center justify-between bg-white border-b-2 border-orange-100 z-10">
        <Link href="/dashboard">
          <motion.div whileTap={{ scale: 0.8 }} className="p-2 bg-orange-100 rounded-xl text-orange-600">
            <ChevronLeft size={24} />
          </motion.div>
        </Link>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <Trophy size={16} className="text-yellow-500" />
            <span className="font-black text-gray-700 text-lg">{score}</span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skor Salsa</span>
        </div>
        <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
          <Gamepad2 size={24} />
        </div>
      </div>

      {/* AREA PERMAINAN */}
      <div className="flex-1 relative bg-gradient-to-b from-blue-50 via-white to-orange-50 flex items-center justify-center overflow-hidden">
        
        {/* Langit & Awan Hiasan */}
        <div className="absolute top-10 left-10 text-4xl opacity-20">☁️</div>
        <div className="absolute top-24 right-10 text-4xl opacity-20">☁️</div>

        {/* Garis Tanah */}
        <div className="absolute bottom-32 w-full h-1 bg-gray-300"></div>
        <div className="absolute bottom-[124px] w-full h-1 bg-gray-200"></div>

        {/* KARAKTER DINO (Salsa/Yudi) */}
        <motion.div
          animate={{ 
            y: isJumping ? -130 : 0,
            rotate: isJumping ? -10 : 0 
          }}
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
          className="absolute bottom-32 left-10 w-14 h-14 bg-orange-500 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-3xl"
        >
          🦖
        </motion.div>

        {/* KAKTUS (PENGHALANG) */}
        <div 
          style={{ left: `${cactusPos}px` }}
          className="absolute bottom-32 w-10 h-12 flex flex-col items-center"
        >
          <div className="w-full h-full bg-green-500 rounded-t-xl shadow-md border-b-4 border-green-700 flex items-center justify-center text-xs">
            🌵
          </div>
        </div>

        {/* TAMPILAN START (Awal Game) */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 bg-orange-500/10 backdrop-blur-[2px] flex flex-col items-center justify-center">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="bg-white p-8 rounded-[40px] shadow-2xl text-center border-4 border-orange-400"
            >
              <h2 className="text-2xl font-black text-gray-800 mb-2">SIAP MAIN?</h2>
              <p className="text-gray-500 text-sm mb-6 font-medium uppercase tracking-tighter">Ketuk layar untuk lompat!</p>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <span className="text-4xl text-orange-600">👆</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* TAMPILAN GAME OVER */}
        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-50"
            >
              <motion.div 
                initial={{ y: 50 }} animate={{ y: 0 }}
                className="bg-white p-8 rounded-[40px] shadow-2xl w-full"
              >
                <div className="text-6xl mb-4">😭</div>
                <h1 className="text-3xl font-black text-gray-800 mb-2">YAH, NABRAK!</h1>
                <p className="text-gray-500 font-bold mb-8 uppercase tracking-widest">Skor Akhir: {score}</p>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-500/40 flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={20} /> MAIN LAGI
                  </button>
                  <Link href="/dashboard" className="w-full">
                    <button className="w-full bg-blue-100 text-blue-600 py-4 rounded-2xl font-black">
                      KEMBALI KE MENU
                    </button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* FOOTER HIASAN */}
      <div className="bg-white p-4 text-center">
        <p className="text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">
          Web Bersama v1.0 • Professional Edition
        </p>
      </div>
    </div>
  )
}
