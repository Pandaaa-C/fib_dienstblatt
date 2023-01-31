import { useUnitStore } from '@/store/unitStore';
import { NetSocket, SocketHandler } from './socketHandler';
import { IUnitData } from '@/../shared/interfaces/unitData';
import { IAgentData } from '@/../shared/interfaces';

const unitSocket = new NetSocket('unitSocket');

if (SocketHandler.addSocket(unitSocket)) {
    const unitStore = useUnitStore();

    unitSocket.connect();

    unitSocket.on('initializeUnits', (units: IUnitData[]) => {
        unitStore.updateUnits(units);
    });
    unitSocket.on('updateUnit', (unit: IUnitData) => {
        unitStore.updateUnit(unit);
    });
    unitSocket.on('deleteUnit', (unitId: string) => {
        unitStore.deleteUnit(unitId);
    });
    unitSocket.on('addUnit', (unit: IUnitData) => {
        unitStore.addUnit(unit);
    });
    unitSocket.on('removeAgentFromUnit', (data: { unitId: string; agentName: string }) => {
        unitStore.removeAgentFromUnit(data.unitId, data.agentName);
    });
    unitSocket.on('addAgentToUnit', (data: { unitId: string; agent: IAgentData }) => {
        unitStore.addAgentToUnit(data.unitId, data.agent);
    });
}
