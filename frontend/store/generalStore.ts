import { defineStore } from 'pinia';
import { IUnitData } from '@shared/interfaces/unitData';

export const useGeneralStore = defineStore('general', {
    state: () => ({
        isInitialized: false,
        generalInfo: {
            globalInfo: '',
            defcon: 0,
            leitstelle: '',
            funk: 1000,
            maxEinsatz: 20,
            currentOperationOfficer: 0,
            swat: '',
        },
    }),
    getters: {
        getGeneralInfo(state): IGeneralInfo {
            return state.generalInfo;
        },
    },
    actions: {},
});

export interface IGeneralInfo {
    globalInfo: string;
    defcon: number;
    leitstelle: string;
    funk: number;
    maxEinsatz: number;
    currentOperationOfficer: number;
    swat: string;
}
