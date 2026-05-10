/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserSettings {
  name: string;
  weight?: number;
  targetWeight: number;
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyWaterGoal: number;
  reminderTimes: string[]; // HH:mm format
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  isQuickAdd?: boolean;
  category?: 'veg' | 'dairy' | 'supplement' | 'shake';
}

export interface MealLog {
  id: string;
  timestamp: number;
  foodId: string;
  name: string;
  calories: number;
  protein: number;
  quantity: number;
}

export interface WeightLog {
  id: string;
  timestamp: number;
  weight: number;
  photoUrl?: string; // Local blob URL or base64 (local only)
}

export interface WaterLog {
  id: string;
  timestamp: number;
  amount: number; // in ml
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
}

export interface WorkoutLog {
  id: string;
  timestamp: number;
  type: 'Push' | 'Pull' | 'Legs';
  exercises: {
    id: string;
    name: string;
    sets: WorkoutSet[];
  }[];
}

export interface ShakeIngredient {
  id: string;
  name: string;
  calories: number;
  protein: number;
  completed: boolean;
}

export interface DailyShakeStatus {
  id: string; // date string YYYY-MM-DD
  timestamp: number;
  completed: boolean;
  ingredients: ShakeIngredient[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}
