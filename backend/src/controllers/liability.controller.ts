import {Body, Controller, Post} from '@nestjs/common';
import {LogController} from "./log.controller";
import {DatabaseService} from "../services/database/database.service";
import {LiabilityGateway} from "../gateways/liability.gateway";
import {Liability} from "../services/database/entities/liability";
import {Logs} from "../services/database/entities/logs";
import {LogTypes} from "@shared/enums";

@Controller('liability')
export class LiabilityController {
    private logController: LogController = new LogController(this.databaseService);
    constructor(private readonly databaseService: DatabaseService, private readonly liabilityGateway: LiabilityGateway) {}

    @Post('addReduction')
    async addReduction(@Body() data: {name: string, jailtime: number, reduction: string, agentName: string, reason: string}) {
        const reduction = await this.databaseService.liabilityCollection.addModelWithReturn(new Liability(data.name, data.jailtime, data.reduction, data.reason, data.agentName));

        await this.logController.createLog(LogTypes.LIABILITY_REDUCTION, "Haftminderung Dokumentiert. (" + reduction.reduction + ")", data.agentName);
        await this.updateLiabilities();

        return { message: 'Du hast erfolgreich eine Haftminderung dokumentiert.' };
    }

    async updateLiabilities() {
        const reductions = await this.databaseService.liabilityCollection.getAllModels();

        console.log(reductions);

        await this.liabilityGateway.emit('initializeReductions', reductions);
    }
}
