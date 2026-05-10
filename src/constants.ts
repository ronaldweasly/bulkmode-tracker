/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FoodItem, ShakeIngredient } from './types';

export const QUICK_ADD_FOODS: FoodItem[] = [
  { id: 'milk', name: 'Milk (250ml)', calories: 150, protein: 8, category: 'dairy', isQuickAdd: true },
  { id: 'banana', name: 'Banana (1pc)', calories: 105, protein: 1, category: 'veg', isQuickAdd: true },
  { id: 'oats', name: 'Oats (50g)', calories: 190, protein: 7, category: 'veg', isQuickAdd: true },
  { id: 'peanut_butter', name: 'Peanut Butter (1tbsp)', calories: 95, protein: 4, category: 'veg', isQuickAdd: true },
  { id: 'soya_chunks', name: 'Soya Chunks (50g)', calories: 170, protein: 25, category: 'veg', isQuickAdd: true },
  { id: 'paneer', name: 'Paneer (100g)', calories: 265, protein: 18, category: 'dairy', isQuickAdd: true },
  { id: 'rice', name: 'Rice (1 bowl)', calories: 200, protein: 4, category: 'veg', isQuickAdd: true },
  { id: 'dal', name: 'Dal (1 bowl)', calories: 150, protein: 8, category: 'veg', isQuickAdd: true },
  { id: 'rajma', name: 'Rajma/Chole', calories: 220, protein: 12, category: 'veg', isQuickAdd: true },
  { id: 'protein_shake', name: 'Protein Shake', calories: 120, protein: 24, category: 'supplement', isQuickAdd: true },
];

export const DEFAULT_SHAKE_INGREDIENTS: ShakeIngredient[] = [
  { id: 'milk_s', name: '500ml Milk', calories: 300, protein: 16, completed: false },
  { id: 'oats_s', name: '100g Oats', calories: 380, protein: 14, completed: false },
  { id: 'banana_s', name: '2 Bananas', calories: 210, protein: 2, completed: false },
  { id: 'pb_s', name: '2tbsp Peanut Butter', calories: 190, protein: 8, completed: false },
  { id: 'protein_s', name: '1 scoop Protein', calories: 120, protein: 24, completed: false },
];

export const WORKOUT_SPLITS = {
  Push: ['Bench Press', 'Incline Dumbbell Press', 'Shoulder Press', 'Lateral Raises', 'Triceps Pushdown'],
  Pull: ['Deadlift', 'Pull Ups', 'Bent Over Rows', 'Facepulls', 'Biceps Curl'],
  Legs: ['Squats', 'RDL', 'Leg Press', 'Leg Extensions', 'Calf Raises'],
};
