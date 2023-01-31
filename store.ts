// @ts-nocheck
import { ObjectId } from 'bson';
import { defineStore } from 'pinia';
import { IServerInfo } from '~~/server/utils/interfaces/serverInfo';
import { IUnitData } from '~~/server/utils/interfaces/unitData';
import { IUserData } from '~~/server/utils/interfaces/userData';
import { IVehicleData } from '~~/server/utils/interfaces/vehicleData';

const state = (): void => ({
    editorMode: false,
    addUnitMode: false,
    crimeRecords: [
        {
            _id: 'acc',
            name: 'Nolan_Christian',
            team: 'LCN',
            location: 'Staatsbank',
            dateTime: '12:00 01/01/2023',
            blackMoney: { person: 1000000, vehicle: 1000000, house: 0 },
            bnc: true,
            agent: 'Mason Velasquez',
            camper: '',
            mord: true,
            illegalItems: false,
            proof: ['', ''],
            open: false,
        },
        {
            _id: 'acc',
            name: 'Nolan_Christian',
            team: 'Irish Mob',
            location: 'Staatsbank',
            dateTime: '12:00 01/01/2023',
            blackMoney: { person: 0, vehicle: 0, house: 0 },
            bnc: true,
            agent: 'Mason Velasquez',
            camper: '',
            mord: true,
            illegalItems: false,
            proof: [''],
            open: true,
        },
    ],
});

const getters = {
    getNotifyMethod(state: any): (message: string) => void | null {
        return state.notify;
    },
    getLoadingComponentActive(state: any): boolean {
        return state.loadingComponentActive;
    },
};

const actions = {
    setLoadingComponentActive(active: boolean): void {
        this.loadingComponentActive = active;
    },
    initializeVehicles(vehicles: IVehicleData[]) {
        this.vehicles = [];

        vehicles.forEach((vehicle: IVehicleData) => {
            this.vehicles.push(vehicle);
        });
    },
    initializeInfo(info: IServerInfo) {
        this.globalInfo = info.globalInfo;
        this.defcon = info.defcon;
        this.leitstelle = info.leitstelle;
        this.funk = info.funk;
    },
    initializeUnit(units: IUnitData[]) {
        this.units = [];

        units.forEach((unit: IUnitData) => {
            this.units.push(unit);
        });
    },
    addUnit(_unit: IUnitData) {
        this.units.push(_unit);
    },
    updateUnit(_unit: IUnitData) {
        const unit: IUnitData = this.units.find((x: IUnitData) => x.name == _unit.name);

        if (unit) {
            unit.activity = _unit.activity;
            unit.vehicle = _unit.vehicle;
            unit.agents = _unit.agents;
            unit.name = _unit.name;
        }
    },
    updateUnitAgents(unitId: string, agents: IUserData[]) {
        const unit: IUnitData = this.units.find((x: IUnitData) => x._id == new ObjectId(unitId));
        unit.agents = agents;
    },
    updateEditorMode() {
        this.editorMode = !this.editorMode;
    },
};

export const useMainStore = defineStore('mainStore', {
    state,
    getters,
    actions,
});
