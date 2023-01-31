import { IVehicleData } from '@shared/interfaces/vehicleData';

export const useVehicleStore = defineStore('vehicles.store', {
    state: () => ({
        isInitialized: false,
        vehicles: [] as IVehicleData[],
    }),
    getters: {
        getVehicles(state): IVehicleData[] {
            return state.vehicles;
        },
    },
    actions: {
        updateVehicles(vehicles: IVehicleData[]) {
            this.vehicles = vehicles;
            this.isInitialized = true;
        },
    },
});
