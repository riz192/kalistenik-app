/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Timer, 
  Dumbbell, 
  Terminal, 
  Code2, 
  Coffee,
  Flame,
  Zap,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Data ---

type Duration = 1 | 5 | 15 | 20 | 30;

interface Exercise {
  name: string;
  duration: string;
}

interface Routine {
  title: string;
  description: string;
  exercises: Exercise[];
  color: string;
}

const ROUTINES: Record<Duration, Routine> = {
  1: {
    title: "Micro-Flow Mobility",
    description: "Quick reset for your joints during a minor code iteration.",
    exercises: [
      { name: "Neck Circles & Tilts", duration: "20s" },
      { name: "Shoulder Rolls", duration: "20s" },
      { name: "Wrist Mobility", duration: "20s" }
    ],
    color: "emerald"
  },
  5: {
    title: "Arch Body Holds & Core",
    description: "Focus on spinal stability while dependencies are installing.",
    exercises: [
      { name: "Arch Body Hold", duration: "45s" },
      { name: "Hollow Body Hold", duration: "45s" },
      { name: "Plank with Shoulder Taps", duration: "60s" },
      { name: "Leg Raises", duration: "90s" },
      { name: "Rest & Breathing", duration: "60s" }
    ],
    color: "emerald"
  },
  15: {
    title: "Ring Chest Flys & Push-ups",
    description: "Strength session for the upper body during a container build.",
    exercises: [
      { name: "Standard Push-ups", duration: "3 sets" },
      { name: "Diamond Push-ups", duration: "2 sets" },
      { name: "Scapula Shrugs", duration: "2 sets" },
      { name: "Isometric Hold at Bottom", duration: "30s" }
    ],
    color: "emerald"
  },
  20: {
    title: "Handstand & Tuck Front Levers",
    description: "Skill work and pulling strength for long-running deployments.",
    exercises: [
      { name: "Wall Walk to Handstand", duration: "3 reps" },
      { name: "Handstand Kick-ups", duration: "5 mins" },
      { name: "Tuck Front Lever Holds", duration: "4 sets" },
      { name: "Australian Pull-ups", duration: "3 sets" }
    ],
    color: "emerald"
  },
  30: {
    title: "Full Muscle-Up Progressions",
    description: "Elite powerhouse routine for extensive AI model training runs.",
    exercises: [
      { name: "Explosive High Pull-ups", duration: "5 sets" },
      { name: "Straight Bar Dips", duration: "5 sets" },
      { name: "False Grip Hangs", duration: "4 sets" },
      { name: "Negative Muscle-ups", duration: "10 reps" },
      { name: "Chin-ups Finisher", duration: "to failure" }
    ],
    color: "emerald"
  }
};

// --- Components ---

export default function App() {
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(null);
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleGenerate = () => {
    if (selectedDuration) {
      setActiveRoutine(ROUTINES[selectedDuration]);
      setTimeLeft(selectedDuration * 60);
      setIsRunning(false);
      setShowSuccess(false);
    }
  };

  const handleComplete = () => {
    setIsRunning(false);
    setShowSuccess(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    if (selectedDuration) {
      setTimeLeft(selectedDuration * 60);
      setIsRunning(false);
      setShowSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Visual Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 md:py-24 space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 mb-2 shadow-2xl"
          >
            <Terminal size={20} className="text-emerald-500" />
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-500 uppercase">System Ready</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-white drop-shadow-sm">
            Call<span className="text-emerald-500">Code</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-sm mx-auto leading-relaxed">
            Boost physical performance during AI agent long-running tasks.
          </p>
        </header>

        {/* Setup Board */}
        <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-xs font-bold font-mono text-slate-500 uppercase tracking-widest">
              <Zap size={14} className="text-emerald-500" />
              Deployment Timeout (Duration)
            </label>
            <div className="grid grid-cols-5 gap-3">
              {([1, 5, 15, 20, 30] as Duration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`py-3 rounded-xl font-mono text-xl transition-all duration-300 border ${
                    selectedDuration === d 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                      : 'bg-slate-800/40 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                  }`}
                  id={`dur-${d}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedDuration}
            className={`w-full py-5 rounded-2xl font-display font-bold text-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
              selectedDuration 
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50'
            }`}
            id="generate-btn"
          >
            <Activity size={24} />
            Generate Routine
          </button>
        </section>

        {/* Display Area */}
        <AnimatePresence mode="wait">
          {activeRoutine && (
            <motion.section
              key={activeRoutine.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
              id="active-area"
            >
              {/* Routine Details Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-[4]">
                  <Dumbbell size={64} className="text-white rotate-45" />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                      <Flame size={28} className="text-emerald-500" />
                      {activeRoutine.title}
                    </h2>
                    <p className="text-slate-400 text-sm italic">{activeRoutine.description}</p>
                  </div>

                  <div className="grid gap-3">
                    {activeRoutine.exercises.map((ex, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700 hover:border-emerald-500/30 transition-colors group">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-500 group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-colors">
                            {i + 1}
                          </span>
                          <span className="font-medium text-slate-200">{ex.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                          {ex.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interaction Center */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 flex flex-col items-center gap-10 shadow-2xl">
                <div className="relative flex flex-col items-center justify-center">
                  <div className="text-7xl md:text-8xl font-mono font-bold tracking-tighter text-white tabular-nums">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-[10px] uppercase font-mono tracking-[0.4em] text-slate-500 mt-2">
                    {isRunning ? 'Execution Active' : 'Thread Paused'}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    onClick={resetTimer}
                    className="p-4 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all active:scale-90"
                    id="reset-btn"
                  >
                    <RotateCcw size={28} />
                  </button>
                  
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
                      isRunning 
                        ? 'bg-slate-800 text-emerald-500 border border-emerald-500/30 hover:bg-slate-700' 
                        : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
                    }`}
                    id="toggle-btn"
                  >
                    {isRunning ? <Pause size={40} fill="currentColor" /> : <Play size={40} className="ml-2" fill="currentColor" />}
                  </button>

                  <button
                    onClick={handleComplete}
                    className="p-4 rounded-2xl bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-all active:scale-90"
                    id="mark-done-btn"
                  >
                    <CheckCircle2 size={28} />
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-slate-950/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-slate-900 border border-emerald-500/20 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl relative"
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 p-6 bg-emerald-500 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                  <CheckCircle2 size={48} className="text-slate-950" />
                </div>
                
                <div className="mt-8 space-y-4">
                  <h3 className="text-3xl font-display font-bold text-white">Build Complete</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Great session, Engineer. Your physical core is synchronized. Time to return to the IDE.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setActiveRoutine(null);
                  }}
                  className="w-full mt-10 py-5 bg-emerald-500 text-slate-950 font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
                  id="dismiss-btn"
                >
                  Return to Work
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="pt-12 border-t border-slate-900 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-4">
            <Code2 size={16} className="text-slate-700" />
            <Coffee size={16} className="text-slate-700" />
            <Dumbbell size={16} className="text-slate-700" />
          </div>
          <p className="text-[10px] font-mono tracking-[0.3em] text-slate-700 uppercase">
            // Developed by Athlete-Dev // CallCode v1.0.0
          </p>
        </footer>
      </div>
    </div>
  );
}
