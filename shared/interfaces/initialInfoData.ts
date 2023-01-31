import { IVehicleData, IServerInfo, IUnitData } from './';

export interface initialInfoData {
    storeVehicles: IVehicleData[];
    info: IServerInfo;
    units: IUnitData[];
}
