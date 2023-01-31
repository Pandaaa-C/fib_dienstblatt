import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../services/database/database.service';
import { IServerInfo, IUnitData, IVehicleData } from '@shared/interfaces/';

@Controller('')
export class AppController {
    constructor(private readonly databaseService: DatabaseService) {}

    @Get('getInitialInfo')
    async getInitialInfo() {
        const vehicles: IVehicleData[] = await this.databaseService.vehicleCollection.getAllModels();
        const info: IServerInfo = await this.databaseService.infoCollection.getOneModel();
        const units: IUnitData[] = await this.databaseService.unitCollection.getAllModels();

        return {
            storeVehicles: vehicles,
            info: info,
            units: units,
        };
    }
}
