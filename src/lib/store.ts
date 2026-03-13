import { writable } from 'svelte/store';
import { mockMains, mockVegs, type FoodItem } from './data';

export type AppState = 'splash' | 'ready' | 'spinning' | 'result';

export const appState = writable<AppState>('splash');

// Kết quả quay: cả món chính + rau (1 lần quay)
export const selectedMain = writable<FoodItem | null>(null);
export const selectedVeg = writable<FoodItem | null>(null);

export const mainMenu = writable<FoodItem[]>(mockMains);
export const vegMenu = writable<FoodItem[]>(mockVegs);

// Track món đang xem cách nấu
export const selectedRecipeItem = writable<FoodItem | null>(null);
