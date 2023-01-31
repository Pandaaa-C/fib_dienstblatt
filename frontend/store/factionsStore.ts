import { IFactionsData } from '@/../shared/interfaces';
import { defineStore } from 'pinia';

export const useFactionsStore = defineStore('factions', {
    state: () => ({
        isInitialized: false,
        factions: [
        ] as IFactionsData[],
    }),
    getters: {
        getRecords(state): IFactionsData[] {
            return state.factions;
        }
    },
    actions: {
        initializeFactions(factions: IFactionsData[]) {
            this.factions = factions;
        },
    },
});
