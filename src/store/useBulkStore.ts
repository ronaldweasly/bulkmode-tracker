/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { dbService } from '../lib/db';
import { 
  MealLog, WeightLog, WaterLog, WorkoutLog, 
  DailyShakeStatus, UserSettings 
} from '../types';
import { format } from 'date-fns';

interface BulkStore {
  settings: UserSettings;
  meals: MealLog[];
  weights: WeightLog[];
  water: WaterLog[];
  workouts: WorkoutLog[];
  shakeStatus: DailyShakeStatus | null;
  isLoading: boolean;

  // Actions
  init: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  addMeal: (meal: Omit<MealLog, 'id' | 'timestamp'>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  addWeight: (weight: number, photoUrl?: string) => Promise<void>;
  addWater: (amount: number) => Promise<void>;
  addWorkout: (workout: Omit<WorkoutLog, 'id' | 'timestamp'>) => Promise<void>;
  updateShake: (ingredients: DailyShakeStatus['ingredients']) => Promise<void>;
  
  // Helpers
  getTodayStats: () => {
    calories: number;
    protein: number;
    water: number;
    workoutDone: boolean;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Gainer',
  targetWeight: 75,
  dailyCalorieGoal: 3000,
  dailyProteinGoal: 120,
  dailyWaterGoal: 4000,
  reminderTimes: ['08:00', '12:00', '16:00', '20:00'],
};

export const useBulkStore = create<BulkStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  meals: [],
  weights: [],
  water: [],
  workouts: [],
  shakeStatus: null,
  isLoading: true,

  init: async () => {
    const settings = await dbService.get('settings', 'current') || DEFAULT_SETTINGS;
    const meals = await dbService.getAll('meals');
    const weights = await dbService.getAll('weights');
    const water = await dbService.getAll('water');
    const workouts = await dbService.getAll('workouts');
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const shakeStatus = await dbService.get('shake', todayStr);

    set({ 
      settings, 
      meals: meals.sort((a, b) => b.timestamp - a.timestamp), 
      weights: weights.sort((a, b) => b.timestamp - a.timestamp), 
      water: water.sort((a, b) => b.timestamp - a.timestamp), 
      workouts: workouts.sort((a, b) => b.timestamp - a.timestamp),
      shakeStatus,
      isLoading: false 
    });
  },

  updateSettings: async (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    await dbService.save('settings', { ...updated, id: 'current' });
    set({ settings: updated });
  },

  addMeal: async (mealData) => {
    const newMeal: MealLog = {
      ...mealData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    await dbService.save('meals', newMeal);
    set((state) => ({ meals: [newMeal, ...state.meals] }));
  },

  deleteMeal: async (id) => {
    await dbService.delete('meals', id);
    set((state) => ({ meals: state.meals.filter(m => m.id !== id) }));
  },

  addWeight: async (weight, photoUrl) => {
    const newWeight: WeightLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      weight,
      photoUrl,
    };
    await dbService.save('weights', newWeight);
    const currentSettings = get().settings;
    const updatedSettings = { ...currentSettings, weight };
    await dbService.save('settings', { ...updatedSettings, id: 'current' });
    set((state) => ({ weights: [newWeight, ...state.weights], settings: updatedSettings }));
  },

  addWater: async (amount) => {
    const newWater: WaterLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      amount,
    };
    await dbService.save('water', newWater);
    set((state) => ({ water: [newWater, ...state.water] }));
  },

  addWorkout: async (workoutData) => {
    const newWorkout: WorkoutLog = {
      ...workoutData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    await dbService.save('workouts', newWorkout);
    set((state) => ({ workouts: [newWorkout, ...state.workouts] }));
  },

  updateShake: async (ingredients) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const allCompleted = ingredients.every(i => i.completed);
    const newStatus: DailyShakeStatus = {
      id: todayStr,
      timestamp: Date.now(),
      completed: allCompleted,
      ingredients,
    };
    await dbService.save('shake', newStatus);
    set({ shakeStatus: newStatus });
  },

  getTodayStats: () => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
    
    const todaysMeals = get().meals.filter(m => m.timestamp >= startOfDay);
    const todaysWater = get().water.filter(w => w.timestamp >= startOfDay);
    const todaysWorkouts = get().workouts.filter(w => w.timestamp >= startOfDay);

    return {
      calories: todaysMeals.reduce((acc, m) => acc + (m.calories * m.quantity), 0),
      protein: todaysMeals.reduce((acc, m) => acc + (m.protein * m.quantity), 0),
      water: todaysWater.reduce((acc, w) => acc + w.amount, 0),
      workoutDone: todaysWorkouts.length > 0,
    };
  }
}));
