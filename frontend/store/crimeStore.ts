import { ICrimesData } from '@/../shared/interfaces';
import { defineStore } from 'pinia';

export const useCrimesStore = defineStore('crimes', {
    state: () => ({
        isInitialized: false,
        crimes: [] as ICrimesData[],
    }),
    getters: {
        getCrimes(state): ICrimesData[] {
            return state.crimes;
        }
    },
    actions: {
        initializeCrimes(crimes: ICrimesData[]) {
            this.crimes = crimes;
        },
    },
});