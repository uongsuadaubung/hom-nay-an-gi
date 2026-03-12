import { writable } from 'svelte/store';
import { mockMains, mockVegs, type FoodItem } from './data';

export type AppState = 'splash' | 'ready' | 'spinning' | 'result';
export type SpinPhase = 'main' | 'veg' | 'done';

export const appState = writable<AppState>('splash');
export const spinPhase = writable<SpinPhase>('main');
export const currentSpinResult = writable<FoodItem | null>(null);

export const selectedMain = writable<FoodItem | null>(null);
export const selectedVeg = writable<FoodItem | null>(null);

export const mainMenu = writable<FoodItem[]>(mockMains);
export const vegMenu = writable<FoodItem[]>(mockVegs);
