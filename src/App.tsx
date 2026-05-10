/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Utensils, 
  Dumbbell, 
  TrendingUp, 
  User, 
  Plus, 
  Droplet, 
  CheckCircle2, 
  Flame,
  Award,
  ChevronRight,
  ArrowRight,
  Trash2,
  Download,
  Upload,
  Camera
} from 'lucide-react';
import { useBulkStore } from './store/useBulkStore';
import { QUICK_ADD_FOODS, DEFAULT_SHAKE_INGREDIENTS, WORKOUT_SPLITS } from './constants';
import { cn } from './lib/utils';
import { format } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell
} from 'recharts';

type ActiveTab = 'home' | 'meals' | 'workout' | 'progress' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const { 
    init, 
    isLoading, 
    settings, 
    getTodayStats, 
    addWater, 
    addMeal, 
    meals,
    weights, 
    addWeight,
    shakeStatus,
    updateShake,
    workouts,
    addWorkout,
    updateSettings,
    deleteMeal
  } = useBulkStore();

  useEffect(() => {
    init();
  }, [init]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const { calories, protein, water, workoutDone } = getTodayStats();

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden pb-24 selection:bg-[#CCFF00]/30">
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <Dashboard 
              stats={{ calories, protein, water, workoutDone }}
              settings={settings}
              addWater={addWater}
              addWeight={addWeight}
              setActiveTab={setActiveTab}
              key="home" 
            />
          )}
          {activeTab === 'meals' && (
            <MealTracker 
              meals={meals}
              addMeal={addMeal}
              deleteMeal={deleteMeal}
              shakeStatus={shakeStatus}
              updateShake={updateShake}
              settings={settings}
              key="meals" 
            />
          )}
          {activeTab === 'workout' && (
            <WorkoutTracker 
              workouts={workouts}
              addWorkout={addWorkout}
              key="workout" 
            />
          )}
          {activeTab === 'progress' && (
            <ProgressView 
              weights={weights}
              meals={meals}
              settings={settings}
              addWeight={addWeight}
              key="progress" 
            />
          )}
          {activeTab === 'profile' && (
            <ProfileView 
              settings={settings}
              updateSettings={updateSettings}
              key="profile" 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-white/5 pb-safe z-50">
        <div className="max-w-md mx-auto flex justify-around items-center h-20 px-2">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={activeTab === 'home' ? 24 : 22} fill={activeTab === 'home' ? 'currentColor' : 'none'} />} label="Home" />
          <NavButton active={activeTab === 'meals'} onClick={() => setActiveTab('meals')} icon={<Utensils size={activeTab === 'meals' ? 24 : 22} />} label="Meals" />
          <NavButton active={activeTab === 'workout'} onClick={() => setActiveTab('workout')} icon={<Dumbbell size={activeTab === 'workout' ? 24 : 22} />} label="Gym" />
          <NavButton active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} icon={<TrendingUp size={activeTab === 'progress' ? 24 : 22} />} label="Gains" />
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={activeTab === 'profile' ? 24 : 22} />} label="Me" />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 rounded-2xl",
        active ? "text-[#CCFF00] bg-[#CCFF00]/10" : "text-zinc-600 hover:text-zinc-400"
      )}
    >
      <motion.div animate={{ scale: active ? 1.1 : 1 }}>{icon}</motion.div>
      <span className="text-[9px] font-black mt-1 uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

// --- SUB-VIEWS ---

function Dashboard({ stats, settings, addWater, addWeight, setActiveTab }: any) {
  const [isLoggingWeight, setIsLoggingWeight] = useState(false);
  const [tempWeight, setTempWeight] = useState(settings.weight || 62.5);

  const handleWeightSubmit = () => {
    addWeight(parseFloat(tempWeight as any));
    setIsLoggingWeight(false);
  };

  const calPercent = Math.min((stats.calories / settings.dailyCalorieGoal) * 100, 100);
  const protPercent = Math.min((stats.protein / settings.dailyProteinGoal) * 100, 100);
  const waterPercent = Math.min((stats.water / settings.dailyWaterGoal) * 100, 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <header className="flex justify-between items-end mb-2">
        <div>
          <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mb-1">Good Morning, {settings.name.split(' ')[0]}</p>
          <h1 className="text-3xl font-bold tracking-tight">Bulk<span className="text-[#CCFF00]">Mode</span></h1>
        </div>
        <div className="flex items-center bg-[#CCFF00] text-black px-3 py-1.5 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(204,255,0,0.3)]">
          <span>🔥 7 DAY STREAK</span>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Calories Card */}
        <div className="col-span-2 relative h-48 bg-[#111] rounded-[2.5rem] p-6 border border-white/5 overflow-hidden group">
          <div className="absolute top-0 left-0 h-full bg-[#CCFF00]/5 transition-all duration-1000" style={{ width: `${calPercent}%` }} />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#CCFF00]/10 rounded-2xl">
                <Flame size={24} className="text-[#CCFF00]" />
              </div>
              <div className="text-right">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Calories</span>
                <p className="text-4xl font-black italic">{Math.round(stats.calories)} <span className="text-gray-500 text-lg font-normal not-italic">/ {settings.dailyCalorieGoal}</span></p>
              </div>
            </div>
            <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${calPercent}%` }}
                className="h-full bg-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.5)]" 
               />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#CCFF00]/5 blur-3xl" />
        </div>

        {/* Protein Card */}
        <div className="bg-[#111] rounded-[2.5rem] p-5 border border-white/5 flex flex-col justify-between relative overflow-hidden h-40">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Award size={64} className="text-[#00FFFF]" />
           </div>
           <div>
             <div className="mb-3 p-2 bg-[#00FFFF]/10 w-fit rounded-xl">
               <Award size={18} className="text-[#00FFFF]" />
             </div>
             <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Protein</span>
             <div className="flex items-baseline gap-1">
               <span className="text-2xl font-black tracking-tight text-[#00FFFF]">{Math.round(stats.protein)}g</span>
               <span className="text-[10px] text-zinc-500 font-bold">/ {settings.dailyProteinGoal}g</span>
             </div>
           </div>
           <div className="h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
             <motion.div animate={{ width: `${protPercent}%` }} className="h-full bg-[#00FFFF]" />
           </div>
        </div>

        {/* Water Card */}
        <button 
          onClick={() => addWater(250)}
          className="bg-[#111] rounded-[2.5rem] p-5 border border-white/5 flex flex-col justify-between items-start text-left relative active:scale-95 transition-transform h-40"
        >
           <div className="absolute top-4 right-4 text-zinc-700">
             <Plus size={16} />
           </div>
           <div className="mb-3 p-2 bg-[#FF8A00]/10 w-fit rounded-xl">
             <Droplet size={18} className="text-[#FF8A00]" />
           </div>
           <div>
             <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Water</span>
             <div className="flex items-baseline gap-1">
               <span className="text-2xl font-black tracking-tight text-[#FF8A00]">{(stats.water / 1000).toFixed(1)}L</span>
               <span className="text-[10px] text-zinc-500 font-bold">/ {(settings.dailyWaterGoal / 1000).toFixed(1)}L</span>
             </div>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full mt-4 overflow-hidden">
             <motion.div animate={{ width: `${waterPercent}%` }} className="h-full bg-[#FF8A00] shadow-[0_0_10px_rgba(255,138,0,0.5)]" />
           </div>
        </button>

        {/* Workout Card */}
        <button 
          onClick={() => setActiveTab('workout')}
          className={cn(
          "col-span-2 p-6 rounded-[2.5rem] border flex items-center justify-between transition-all duration-300 text-left w-full",
          stats.workoutDone 
            ? "bg-[#111] border-white/5 cursor-default" 
            : "bg-[#CCFF00] border-transparent shadow-[0_0_20px_rgba(204,255,0,0.1)] group active:scale-95"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-4 rounded-3xl",
              stats.workoutDone ? "bg-white/5 text-zinc-500" : "bg-black text-[#CCFF00] shadow-lg"
            )}>
              <Dumbbell size={28} />
            </div>
            <div>
              <p className={cn("text-lg font-bold", !stats.workoutDone && "text-black")}>
                {stats.workoutDone ? "Gym Smashed" : "Push Day?"}
              </p>
              <p className={cn("text-xs font-bold uppercase tracking-widest", stats.workoutDone ? "text-zinc-500" : "text-black/60")}>
                {stats.workoutDone ? "REST & RECOVER" : "TIME TO GROW"}
              </p>
            </div>
          </div>
          {stats.workoutDone ? (
            <CheckCircle2 size={32} className="text-[#00FFFF]" />
          ) : (
             <ChevronRight size={24} className="text-black" />
          )}
        </button>

        {/* Weight Log Quick Card */}
        <div className="col-span-2 bg-[#111] rounded-[2.5rem] p-6 border border-white/5 flex flex-col gap-4 group">
          <div className="flex justify-between items-center w-full">
            <div>
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block mb-1">Current Weight</span>
              <p className="text-3xl font-black">{settings.weight || 62.5} <span className="text-sm font-bold text-zinc-600 tracking-normal italic">kg</span></p>
            </div>
            {!isLoggingWeight && (
              <button 
                onClick={() => setIsLoggingWeight(true)}
                className="p-4 bg-white/5 rounded-3xl group-hover:bg-[#CCFF00] group-hover:text-black transition-all"
              >
                <Plus size={24} />
              </button>
            )}
          </div>
          
          <AnimatePresence>
            {isLoggingWeight && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-4"
              >
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    type="number"
                    step="0.1"
                    value={tempWeight}
                    onChange={(e) => setTempWeight(e.target.value as any)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 font-black text-xl outline-none focus:border-[#CCFF00]/50"
                  />
                  <button 
                    onClick={handleWeightSubmit}
                    className="bg-[#CCFF00] text-black font-black px-6 rounded-2xl hover:bg-[#d8ff00] active:scale-95 transition-all text-sm uppercase tracking-widest"
                  >
                    Save
                  </button>
                </div>
                <button 
                  onClick={() => setIsLoggingWeight(false)}
                  className="w-full text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function MealTracker({ meals, addMeal, deleteMeal, shakeStatus, updateShake, settings }: any) {
  const currentShake = shakeStatus?.ingredients || DEFAULT_SHAKE_INGREDIENTS;
  const shakeProgress = (currentShake.filter(i => i.completed).length / currentShake.length) * 100;

  const toggleShakeIngredient = (id: string) => {
    const next = currentShake.map(i => i.id === id ? { ...i, completed: !i.completed } : i);
    updateShake(next);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Bulk<span className="text-[#CCFF00]">Fuel</span></h1>
        <p className="text-zinc-500 font-medium">Vegetarian Powerhouse</p>
      </header>

      {/* Mass Gainer Shake Section */}
      <section className="bg-[#111] rounded-[2.5rem] p-6 border border-white/5 shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-2xl group active:scale-95 transition-transform">🥤</div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Special Task</p>
                <p className="text-lg font-bold">Daily Mass Shake</p>
              </div>
            </div>
            <div className="text-right">
              <span className={cn(
                "text-2xl font-black transition-colors",
                shakeProgress === 100 ? "text-[#CCFF00]" : "text-white"
              )}>{Math.round(shakeProgress)}%</span>
            </div>
          </div>

          <div className="space-y-3">
            {currentShake.map(ing => (
              <button 
                key={ing.id}
                onClick={() => toggleShakeIngredient(ing.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all border",
                  ing.completed 
                    ? "bg-[#CCFF00]/10 border-[#CCFF00]/20 text-[#CCFF00]" 
                    : "bg-white/5 border-transparent text-zinc-400 hover:border-white/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors",
                    ing.completed ? "bg-[#CCFF00] border-[#CCFF00]" : "border-zinc-700"
                  )}>
                    {ing.completed && <CheckCircle2 size={14} className="text-black font-black" />}
                  </div>
                  <span className="font-bold text-sm tracking-tight">{ing.name}</span>
                </div>
                <span className="text-[10px] font-black opacity-40 uppercase">{ing.protein}g P</span>
              </button>
            ))}
          </div>

          {shakeProgress === 100 && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="mt-6 bg-[#CCFF00] text-black p-4 rounded-2xl text-center font-black text-sm uppercase tracking-widest"
            >
              Goal Complete! 🔥
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick Add Grid */}
      <section>
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600">Quick Add Foods</h2>
          <span className="text-[10px] text-[#CCFF00] font-bold tracking-widest">EDIT FAVORITES</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ADD_FOODS.slice(0, 8).map(food => (
            <button 
              key={food.id}
              onClick={() => addMeal({ foodId: food.id, name: food.name, calories: food.calories, protein: food.protein, quantity: 1 })}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl active:scale-90 transition-all hover:border-[#CCFF00]/50 hover:bg-white/10">
                {food.id === 'milk' && '🥛'}
                {food.id === 'banana' && '🍌'}
                {food.id === 'oats' && '🥣'}
                {food.id === 'peanut_butter' && '🥜'}
                {food.id === 'soya_chunks' && '📦'}
                {food.id === 'paneer' && '🧀'}
                {food.id === 'rice' && '🍚'}
                {food.id === 'dal' && '🍲'}
                {food.id === 'rajma' && '🍛'}
                {food.id === 'protein_shake' && '🥤'}
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter truncate w-full text-center">
                {food.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Log */}
      <section>
        <div className="flex justify-between items-center mb-4 px-2">
           <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">Today's Log</h2>
           <span className="text-zinc-500 font-bold text-xs">{meals.length} entries</span>
        </div>
        <div className="space-y-2">
          {meals.slice(0, 5).map((meal: any) => (
            <div key={meal.id} className="bg-zinc-900/50 rounded-2xl p-4 flex justify-between items-center group">
              <div>
                <p className="font-bold">{meal.name}</p>
                <p className="text-[10px] text-zinc-500 font-black tracking-widest">{format(meal.timestamp, 'HH:mm')} • {meal.calories} KCAL • {meal.protein}G P</p>
              </div>
              <button onClick={() => deleteMeal(meal.id)} className="p-2 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {meals.length === 0 && (
            <div className="text-center py-10 text-zinc-600 italic">No food logged today yet.</div>
          )}
        </div>
      </section>
    </motion.div>
  );
}

function WorkoutTracker({ workouts, addWorkout }: any) {
  const [selectedSplit, setSelectedSplit] = useState<keyof typeof WORKOUT_SPLITS | null>(null);

  const completeWorkout = () => {
    if (!selectedSplit) return;
    addWorkout({ 
      type: selectedSplit, 
      exercises: WORKOUT_SPLITS[selectedSplit].map(name => ({ id: crypto.randomUUID(), name, sets: [] })) 
    });
    setSelectedSplit(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Bulk<span className="text-[#CCFF00]">Gym</span></h1>
        <p className="text-zinc-500 font-medium tracking-tight">Simple Progressive Overload</p>
      </header>

      {!selectedSplit ? (
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em] mb-2 px-2">Select Your Split</h2>
          {(Object.keys(WORKOUT_SPLITS) as Array<keyof typeof WORKOUT_SPLITS>).map(split => (
            <button 
              key={split}
              onClick={() => setSelectedSplit(split)}
              className="w-full bg-[#111] border border-white/5 p-8 rounded-[2.5rem] flex justify-between items-center hover:border-[#CCFF00]/30 group transition-all"
            >
              <div>
                <h3 className="text-2xl font-black italic tracking-tight">{split} Day</h3>
                <p className="text-[10px] font-black text-zinc-500 uppercase mt-1 tracking-widest">{WORKOUT_SPLITS[split].length} Exercises</p>
              </div>
              <div className="p-4 bg-white/5 rounded-3xl group-hover:bg-[#CCFF00] transition-colors">
                 <ChevronRight size={24} className="group-hover:text-black" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <button onClick={() => setSelectedSplit(null)} className="text-zinc-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-1 hover:text-white transition-colors">
              <ChevronRight size={14} className="rotate-180" /> Back
            </button>
            <h2 className="text-xl font-black underline decoration-[#CCFF00] underline-offset-8 italic">{selectedSplit} Day</h2>
          </div>

          <div className="space-y-3">
             {WORKOUT_SPLITS[selectedSplit].map((name, i) => (
                <div key={i} className="bg-[#111] border border-white/5 p-5 rounded-3xl flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-700 font-black text-xl italic group-hover:text-[#CCFF00] transition-colors">{String(i+1).padStart(2, '0')}</span>
                    <span className="font-bold tracking-tight">{name}</span>
                  </div>
                  <CheckCircle2 className="text-zinc-800" size={24} />
                </div>
             ))}
          </div>

          <button 
            onClick={completeWorkout}
            className="w-full bg-[#CCFF00] text-black font-black p-6 rounded-[2rem] hover:bg-[#d8ff00] transition-all flex items-center justify-center gap-2 group shadow-[0_10px_30px_rgba(204,255,0,0.2)]"
          >
            FINISH WORKOUT 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}

      <section>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4 px-2">Recent Gains</h2>
        <div className="space-y-2">
          {workouts.slice(0, 3).map((w: any) => (
            <div key={w.id} className="bg-[#111] border border-white/5 p-4 rounded-2xl flex justify-between items-center group">
               <div>
                 <p className="font-bold tracking-tight italic">{w.type} Day</p>
                 <p className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">{format(w.timestamp, 'PPP')}</p>
               </div>
               <div className="p-2 bg-[#CCFF00]/10 rounded-xl">
                 <Award size={18} className="text-[#CCFF00]" />
               </div>
            </div>
          ))}
          {workouts.length === 0 && <p className="text-center py-6 text-zinc-700 italic text-sm">No workouts recorded.</p>}
        </div>
      </section>
    </motion.div>
  );
}

function ProgressView({ weights, meals, settings, addWeight }: any) {
  const [isLoggingWeight, setIsLoggingWeight] = useState(false);
  const [tempWeight, setTempWeight] = useState(settings.weight || 62.5);

  const handleWeightSubmit = () => {
    addWeight(parseFloat(tempWeight as any));
    setIsLoggingWeight(false);
  };

  // Chart Data preparation
  const weightData = weights.slice().reverse().map((w: any) => ({
    date: format(w.timestamp, 'MM/dd'),
    weight: typeof w.weight === 'number' ? w.weight : parseFloat(w.weight)
  })).slice(-14);

  const currentWeight = weights[0]?.weight || 0;
  const initialWeight = weights[weights.length - 1]?.weight || 0;
  const gained = (currentWeight - initialWeight).toFixed(1);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Bulk<span className="text-[#CCFF00]">Stat</span></h1>
        <p className="text-zinc-500 font-medium">Tracking the transformation</p>
      </header>

      {/* Hero Achievement Box */}
      <div className="bg-[#CCFF00] p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
         <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-10 -right-10 opacity-10 text-black"
         >
           <Award size={180} />
         </motion.div>
         <div className="relative z-10 text-black">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2 block">Total Gained</span>
           <h2 className="text-6xl font-black italic">{gained} <span className="text-xl italic font-medium not-italic">kg</span></h2>
           <div className="flex items-center gap-2 mt-4">
             <span className="text-xs font-bold uppercase tracking-widest opacity-60">Hardgainer Phase 1</span>
             <Award size={16} className="text-black" />
           </div>
         </div>
      </div>

      {/* Weight Chart */}
      <section className="bg-[#111] border border-white/5 p-6 rounded-[2.5rem]">
        <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-6 px-1">Weight Progress</h3>
        <div className="h-64 w-full flex items-center justify-center">
          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <XAxis dataKey="date" stroke="#27272a" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#CCFF00', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#CCFF00" 
                  strokeWidth={4} 
                  dot={{ fill: '#CCFF00', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 8, stroke: '#000', strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-zinc-600 text-sm italic">Log weight to reveal chart</div>
          )}
        </div>
      </section>

      {/* Stats Table */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem]">
           <span className="text-[#CCFF00] text-[10px] font-black uppercase block mb-1 tracking-widest">Goal</span>
           <p className="text-2xl font-black italic">{settings.targetWeight}kg</p>
           <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Remain: {(settings.targetWeight - currentWeight).toFixed(1)}kg</p>
        </div>
        <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem]">
           <span className="text-[#00FFFF] text-[10px] font-black uppercase block mb-1 tracking-widest">Growth</span>
           <p className="text-2xl font-black italic">+1.2kg</p>
           <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 italic tracking-tight">Optimal Phase</p>
        </div>
      </div>

      <div className="space-y-4">
        {!isLoggingWeight ? (
          <button
            onClick={() => setIsLoggingWeight(true)}
            className="w-full bg-[#111] border border-white/5 p-6 rounded-[2rem] flex items-center justify-center gap-3 text-zinc-400 font-black uppercase text-xs tracking-[0.2em] hover:border-[#CCFF00]/40 hover:text-white transition-all group"
          >
            <Camera size={20} className="group-hover:scale-110 transition-transform text-[#CCFF00]" />
            Log Weight & Gains
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-[#CCFF00]/20 p-6 rounded-[2rem] space-y-4"
          >
            <div className="flex gap-2">
              <input 
                autoFocus
                type="number"
                step="0.1"
                value={tempWeight}
                onChange={(e) => setTempWeight(e.target.value as any)}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 font-black text-xl outline-none focus:border-[#CCFF00]/50"
              />
              <button 
                onClick={handleWeightSubmit}
                className="bg-[#CCFF00] text-black font-black px-6 rounded-2xl hover:bg-[#d8ff00] active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                Save
              </button>
            </div>
            <button 
              onClick={() => setIsLoggingWeight(false)}
              className="w-full text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ProfileView({ settings, updateSettings }: any) {
  const [name, setName] = useState(settings.name);
  const [target, setTarget] = useState(settings.targetWeight);

  const handleExport = () => {
    const exportData = {
      settings,
      timestamp: Date.now(),
      v: 1
    };
    const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulkmode_backup_${format(new Date(), 'yyyyMMdd')}.json`;
    a.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col items-center pt-8 pb-4">
        <div className="w-24 h-24 bg-[#111] border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#CCFF00]/5 blur-2xl" />
          <User size={48} className="text-[#CCFF00] relative z-10" />
          <div className="absolute -bottom-1 -right-1 bg-[#CCFF00] p-2 rounded-xl shadow-lg border-4 border-[#050505] z-20">
            <Award size={16} className="text-black" />
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tight italic">{settings.name}</h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Hardgainer Phase 1</p>
      </header>

      <div className="space-y-6">
        <section>
          <h2 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em] mb-4 px-2">Settings</h2>
          <div className="bg-[#111] rounded-[2rem] border border-white/5 divide-y divide-white/5">
            <div className="p-5 flex justify-between items-center group">
              <div>
                <p className="font-bold tracking-tight">Display Name</p>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Identity</p>
              </div>
              <input 
                value={name} 
                onBlur={() => updateSettings({ name })}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 rounded-xl px-4 py-2 text-sm font-black text-right outline-none ring-[#CCFF00] focus:ring-1 transition-all"
              />
            </div>
            <div className="p-5 flex justify-between items-center group">
              <div>
                <p className="font-bold tracking-tight">Target Weight</p>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">End Goal (kg)</p>
              </div>
              <input 
                type="number"
                value={target} 
                onBlur={() => updateSettings({ targetWeight: parseFloat(target) })}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-white/5 rounded-xl px-4 py-2 text-sm font-black w-20 text-right outline-none ring-[#CCFF00] focus:ring-1 transition-all"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em] mb-4 px-2">Data Management</h2>
          <div className="grid grid-cols-2 gap-4">
             <button 
              onClick={handleExport}
              className="bg-[#111] border border-white/5 p-6 rounded-[2.2rem] flex flex-col gap-4 group hover:border-[#CCFF00]/40 transition-all text-left"
             >
               <Download size={28} className="text-[#CCFF00] group-hover:scale-110 transition-transform" />
               <div>
                  <p className="font-black text-sm uppercase tracking-tight">Backup</p>
                  <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Export JSON</p>
               </div>
             </button>
             <button 
              className="bg-[#111] border border-white/5 p-6 rounded-[2.2rem] flex flex-col gap-4 group hover:border-[#00FFFF]/40 transition-all text-left"
             >
               <Upload size={28} className="text-[#00FFFF] group-hover:scale-110 transition-transform" />
               <div>
                  <p className="font-black text-sm uppercase tracking-tight">Restore</p>
                  <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Import File</p>
               </div>
             </button>
          </div>
        </section>

        <button className="w-full bg-red-500/5 text-red-500/60 border border-red-500/10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-red-500 hover:text-white">
          Reset All Progress
        </button>

        <div className="text-center py-6">
          <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em]">BulkMode V1.0</p>
        </div>
      </div>
    </motion.div>
  );
}
