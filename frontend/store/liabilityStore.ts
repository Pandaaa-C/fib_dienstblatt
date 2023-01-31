import { defineStore } from 'pinia';
import {ILiabilityData} from "@shared";

export const useLiabilityStore = defineStore('liability', {
    state: () => ({
        isInitialized: false,
        reductions: [] as ILiabilityData[]
    }),
    getters: {
    },
    actions: {},
});
