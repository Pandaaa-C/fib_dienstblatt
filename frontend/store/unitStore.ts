import { defineStore } from 'pinia';
import { IUnitData } from '@shared/interfaces/unitData';
import { IAgentData } from '@/../shared/interfaces';

export const useUnitStore = defineStore('units', {
    state: () => ({
        isInitialized: false,
        units: [] as IUnitData[],
    }),
    getters: {
        getUnits(state): IUnitData[] {
            return state.units;
        },
    },
    actions: {
        updateUnits(units: IUnitData[]): void {
            this.units = units;
        },
        updateUnit(unit: IUnitData): void {
            const index = this.units.findIndex(searchedUnit => searchedUnit._id === unit._id);

            if (index === -1) return;

            this.units[index] = unit;
        },
        deleteUnit(unitId: string): void {
            const index = this.units.findIndex(searchedUnit => searchedUnit._id.toString() === unitId);

            if (index === -1) return;

            this.units.splice(index, 1);
        },
        addUnit(unit: IUnitData): void {
            this.units.push(unit);
        },
        removeAgentFromUnit(unitId: string, agentName: string): void {
            const index = this.units.findIndex(searchedUnit => searchedUnit._id.toString() === unitId);

            if (index === -1) return;

            const agentIndex = this.units[index].agents.findIndex(agent => agent.name === agentName);

            if (agentIndex === -1) return;

            this.units[index].agents.splice(agentIndex, 1);
        },
        addAgentToUnit(unitId: string, agentData: IAgentData): void {
            const index = this.units.findIndex(searchedUnit => searchedUnit._id.toString() === unitId);

            if (index === -1) return;
            
            this.units[index].agents.push(agentData);
        },
    },
});
