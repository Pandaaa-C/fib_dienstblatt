/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { LogTypes } from '@shared/enums/logEnum';
import { hash } from 'bcrypt';
import { ObjectId } from 'mongodb';
import { FactionsGateway } from 'src/gateways/factions.gateway';
import { DatabaseService } from 'src/services/database/database.service';
import { Factions } from 'src/services/database/entities';
import { LogController } from './log.controller';

@Controller('factions')
export class FactionsController {
    private logController: LogController = new LogController(this.databaseService);
    constructor(private readonly databaseService: DatabaseService, private factionsGateway: FactionsGateway) {}

    @Post('addFaction')
    async addFaction(@Body() data: { agentId: string; factionName: string; shortName: string; }) {
        const agent = await this.databaseService.userCollection.getOneModel({ _id: new ObjectId(data.agentId) });
        if (agent == null || !agent.admin) {
            return { message: "Es ist ein Fehler unterlaufen." }
        }

        const exists = await this.databaseService.factionsCollection.getOneModel({ factionName: data.factionName });
        if (exists != null) {
            return { message: "Es existiert bereits eine Fraktion mit diesem Namen." }
        }

        const faction = new Factions(data.factionName, data.shortName);
        await this.databaseService.factionsCollection.addModel(faction);
        
        this.logController.createLog(LogTypes.DATABASE, "Fraktion hinzugefügt (" + faction.factionName + ").", agent.name);
        
        this.factionsGateway.emit('initializeFactions', await this.databaseService.factionsCollection.getAllModels());

        return { message: "Du hast die Fraktion erfolgreich hinzugefügt." }
    }
}
