/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Timer, Dumbbell, Terminal, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Routine {
  id: number;
  title: string;
  exercises: { name: string; duration: string; reps?: string }[];
}

const ROUTINES: Record<number, Routine> = {
  1: {
    id: 1,
    title: 'Quick Mobility Spark',
    exercises: [
      { name: 'Wrist Circles', duration: '20s' },
      { name: 'Neck Rotations', duration: '20s' },
      { name: 'Shoulder Rolls', duration: '20s' },
    ],
  },
  5: {
    id: 5,
    title: 'Arch Body Holds & Core',
    exercises: [
      { name: 'Arch Body Hold', duration: '45s' },
      { name: 'Hollow Body Hold', duration: '45s' },
      { name: 'Plank', duration: '60s' },
      { name: 'Leg Raises', duration: '2x15 reps' },
    ],
  },
  15: {
    id: 15,
    title: 'Ring Chest Flys & Push-ups',
    exercises: [
      { name: 'Standard Push-ups', duration: '3 sets of 12' },
      { name: 'Ring Chest Flys', duration: '3 sets of 8' },
      { name: 'Diamond Push-ups', duration: '2 sets to failure' },
      { name: 'Dips', duration: '3 sets of 10' },
    ],
  },
  20: {
    id: 20,
    title: 'Handstand Practice & Tuck Front Levers',
    exercises: [
      { name: 'Wall Handstand Hold', duration: '60s' },
      { name: 'Tuck Front Lever Hold', duration: '30s x 3' },
      { name: 'Scapula Pull-ups', duration: '3 sets of 15' },
      { name: 'Handstand Kick-up Practice', duration: '5 minutes' },
    ],
  },
  30: {
    id: 30,
    title: 'Full Muscle-Up Progressions',
    exercises: [
      { name: 'Explosive Pull-ups', duration: '5 sets of 5' },
      { name: 'Straight Bar Dips', duration: '4 sets of 10' },
      { name: 'False Grip Hang', duration: '30s x 4' },
      { name: 'Muscle-Up Transitions', duration: '10 sets of 1' },
      { name: 'Chin-ups', duration: '3 sets to failure' },
    ],
  },
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(5);
  const [timerInterval, setTimerInterval] = useState<number>(1000);
  const [currentRoutine, setCurrentRoutine] = useState<Routine | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle Theme
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Audio System using Web Audio API
  const playSound = (type: 'start' | 'pause' | 'reset' | 'finish') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'start') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, now); // A5
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
      } else if (type === 'pause') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, now); // A4
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
      } else if (type === 'reset') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, now); // A3
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
      } else if (type === 'finish') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.exponentialRampToValueAtTime(1046.50, now + 0.5); // C6
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
      }
    } catch (e) {
      console.warn('Audio contextual initialization failed', e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerate = () => {
    setCurrentRoutine(ROUTINES[selectedMinutes]);
    setTimeLeft(selectedMinutes * 60);
    setIsActive(false);
    setIsDone(false);
  };

  const toggleTimer = () => {
    const nextActive = !isActive;
    setIsActive(nextActive);
    playSound(nextActive ? 'start' : 'pause');
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedMinutes * 60);
    setIsDone(false);
    playSound('reset');
  };

  const markAsDone = () => {
    setIsActive(false);
    setIsDone(true);
    setTimeLeft(0);
    playSound('finish');
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, timerInterval);
    } else if (timeLeft === 0 && isActive) {
      setIsDone(true);
      setIsActive(false);
      playSound('finish');
      clearInterval(timerRef.current!);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, timerInterval]);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-emerald-500/30 selection:text-emerald-400 ${
      isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] ${
          isDarkMode ? 'bg-emerald-900/10' : 'bg-emerald-500/5'
        }`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] ${
          isDarkMode ? 'bg-emerald-900/10' : 'bg-emerald-500/5'
        }`} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border transition-colors ${
                isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-500/5 border-emerald-500/10'
              }`}>
                <Terminal className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className={`text-3xl md:text-4xl font-display font-bold tracking-tight transition-colors ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Call<span className="text-emerald-500">Code</span>
              </h1>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-3 rounded-2xl border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-slate-900/50 border-slate-800 text-emerald-400 hover:border-emerald-500 shadow-lg shadow-emerald-500/5' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-500 shadow-sm'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <p className={`text-lg md:text-xl max-w-md transition-colors ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Optimalkan waktu tunggu rintelijen buatan (AI) dengan rutinitas kalistenik singkat.
          </p>
        </header>

        {/* Configuration Section */}
        <div className={`backdrop-blur-xl border rounded-3xl p-8 mb-12 shadow-2xl space-y-8 transition-all duration-300 ${
          isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}>
          {/* Duration Selection */}
          <div>
            <label className="block text-emerald-500 font-medium text-xs uppercase tracking-widest mb-4 text-center opacity-70">
              Pilih Durasi Menunggu
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {[1, 5, 15, 20, 30].map((min) => (
                <button
                  key={min}
                  onClick={() => setSelectedMinutes(min)}
                  className={`py-4 px-2 rounded-2xl border transition-all duration-300 font-display font-bold text-xl flex flex-col items-center gap-1
                    ${selectedMinutes === min 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                      : isDarkMode
                        ? 'bg-slate-800/40 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                    }`}
                >
                  {min}
                  <span className="text-[10px] uppercase tracking-tighter opacity-70">Min</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speed Selection */}
          <div>
            <label className="block text-emerald-500 font-medium text-xs uppercase tracking-widest mb-4 text-center opacity-70">
              Timer Interval (Speed)
            </label>
            <div className="flex justify-center gap-4">
              {[1, 5, 10].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setTimerInterval(sec * 1000)}
                  className={`flex-1 max-w-[100px] py-3 rounded-xl border transition-all duration-300 font-mono text-sm
                    ${timerInterval === sec * 1000
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                      : isDarkMode
                        ? 'bg-slate-800/40 border-slate-700 text-slate-500 hover:text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-5 rounded-2xl transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Dumbbell className="w-5 h-5" />
            Generate Routine
          </button>
        </div>

        {/* Display Area */}
        <AnimatePresence mode="wait">
          {currentRoutine && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid gap-8"
            >
              <div className={`backdrop-blur-xl border rounded-3xl p-8 relative overflow-hidden shadow-2xl transition-all duration-300 ${
                isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                {/* Timer Display */}
                <div className={`flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b pb-12 transition-colors ${
                  isDarkMode ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <div className="text-center md:text-left">
                    <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-2">Active Routine</h2>
                    <h3 className={`text-3xl font-display font-bold transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>{currentRoutine.title}</h3>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className={`font-display font-bold text-6xl md:text-7xl tabular-nums flex items-center gap-4 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      <Timer className={`w-10 h-10 ${isActive ? 'animate-pulse text-emerald-500' : isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                      {formatTime(timeLeft)}
                    </div>
                    
                    <div className="flex gap-4 mt-8">
                      <button
                        onClick={toggleTimer}
                        disabled={isDone}
                        className={`p-4 rounded-full transition-all duration-300 ${isDone ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'} ${
                          isActive 
                            ? 'bg-rose-500/10 text-rose-500' 
                            : 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                        }`}
                      >
                        {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </button>
                      <button
                        onClick={resetTimer}
                        className={`p-4 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                          isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <RotateCcw className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Exercises List */}
                <div className="space-y-4 mb-4">
                  <h4 className="text-emerald-500/50 text-xs font-bold uppercase tracking-[0.2em] mb-4">Workout Log</h4>
                  {currentRoutine.exercises.map((ex, idx) => (
                    <div 
                      key={idx}
                      className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-slate-800/30 border-slate-800/50 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]' 
                          : 'bg-slate-50 border-slate-100 hover:border-emerald-500/30 hover:bg-emerald-500/[0.01]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold transition-colors ${
                          isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
                        } group-hover:text-emerald-500 group-hover:border-emerald-500/30`}>
                          {idx + 1}
                        </span>
                        <span className={`font-medium transition-colors ${
                          isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-950'
                        }`}>{ex.name}</span>
                      </div>
                      <span className="text-emerald-500 font-display font-medium text-sm bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">
                        {ex.duration}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mark as Done */}
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={markAsDone}
                    disabled={isDone}
                    className={`group relative flex items-center gap-2 px-8 py-4 bg-transparent border rounded-2xl transition-all duration-300 disabled:opacity-50 ${
                      isDarkMode 
                        ? 'border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-500' 
                        : 'border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-500'
                    }`}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${isDone ? 'text-emerald-500' : ''}`} />
                    <span className="font-bold tracking-wide">Mark as Done</span>
                  </button>
                </div>

                {/* Success Overlay */}
                <AnimatePresence>
                  {isDone && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-20 bg-emerald-500/90 backdrop-blur-md flex flex-col items-center justify-center text-slate-950 p-6 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.5, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12 }}
                      >
                        <CheckCircle2 className="w-24 h-24 mb-6" />
                      </motion.div>
                      <h2 className="text-4xl font-display font-bold mb-2">Great Work, Dev!</h2>
                      <p className="text-lg font-medium opacity-80 mb-8 max-w-xs">
                        Tubuh bugar, kode makin lancar. AI agentmu mungkin sudah selesai sekarang.
                      </p>
                      <button
                        onClick={() => {
                          setIsDone(false);
                          setCurrentRoutine(null);
                        }}
                        className={`font-bold px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all ${
                          isDarkMode ? 'bg-slate-950 text-white' : 'bg-emerald-950 text-emerald-50'
                        }`}
                      >
                        Siap Lanjut Coding
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info for Developers */}
        <footer className={`mt-20 pt-8 border-t text-center transition-colors ${
          isDarkMode ? 'border-slate-900 text-slate-600' : 'border-slate-200 text-slate-400'
        }`}>
          <p className="text-xs font-mono">
            {`// CallCode v1.0.0 — Ready for long-running deployments`}
          </p>
        </footer>
      </div>
    </div>
  );
}
