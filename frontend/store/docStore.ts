import { IDocFileData } from '@/../shared/interfaces';
import { defineStore } from 'pinia';

export const useDocStore = defineStore('doc', {
    state: () => ({
        isInitialized: false,
        records: [
            // { _id: 'abc', wantedName: 'Panda_Code', faction: 'FIB', dateTime: '12:00 01.01.2023', agent: 'Mason_Velasquez', info: 'Nigga123\nabc', finished: false }
        ] as IDocFileData[],
    }),
    getters: {
        getRecords(state): IDocFileData[] {
            return state.records;
        }
    },
    actions: {
        initializeRecords(records: IDocFileData[]) {
            this.records = records;
        },
    },
});
