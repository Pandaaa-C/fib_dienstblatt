import { IVehicleData } from '@/../shared/interfaces';
import { NetSocket, SocketHandler } from './socketHandler';
import { useVehicleStore } from '@/store/vehiclesStore';

const vehicleSocket = new NetSocket('vehicleSocket');

if (SocketHandler.addSocket(vehicleSocket)) {
    const vehicleStore = useVehicleStore();

    vehicleSocket.connect();

    vehicleSocket.on('initializeVehicles', (vehicles: IVehicleData[]) => {
        vehicleStore.updateVehicles(vehicles);
    });
    // vehicleSocket.on('updateUnit', (unit: IUnitData) => {
    // unitStore.updateUnit(unit);
    // });
    // vehicleSocket.on('deleteUnit', (: string) => {
    // unitStore.deleteUnit(unitId);
    // });
    // vehicleSocket.on('addUnit', (unit: IUnitData) => {
    // unitStore.addUnit(unit);
    // });
}
