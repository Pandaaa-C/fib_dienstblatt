/*
https://docs.nestjs.com/controllers#controllers
*/

import {Body, Controller, Get, Post} from '@nestjs/common';
import { LogTypes } from '@shared/enums/logEnum';
import { hash } from 'bcrypt';
import { ObjectId } from 'mongodb';
import { DatabaseService } from 'src/services/database/database.service';
import { Vehicles } from 'src/services/database/entities';
import { LogController } from './log.controller';

@Controller('admin')
export class AdminController {
    private logController: LogController = new LogController(this.databaseService);
    constructor(private readonly databaseService: DatabaseService) {}

    @Post('checkAdminStatus')
    async checkAdminStatus(@Body() data: { id: string }) {
        const agent = await this.databaseService.userCollection.getOneModel({ _id: new ObjectId(data.id) });
        if (agent != null) {
            return agent.admin;
        }

        return false;
    }

    @Post('resetPassword')
    async resetPassword(@Body() data: { agentId: string; agentName: string; }) {
        const agent = await this.databaseService.userCollection.getOneModel({ _id: new ObjectId(data.agentId) });
        if (agent == null || !agent.admin) {
            return { message: "Es ist ein Fehler unterlaufen." }
        }

        const targetAgent = await this.databaseService.userCollection.getOneModel({ name: data.agentName });
        if (targetAgent == null) {
            return { message: "Es gibt kein Benutzer mit diesen Namen." }
        }

        await this.databaseService.userCollection.updateModel({ _id: targetAgent._id }, {
            $set: {
                password: await hash("123456", 10)
            }
        });
        
        this.logController.createLog(LogTypes.DATABASE, targetAgent.name + " sein Passwort wurde zurückgesetzt.", agent.name);

        return { message: "Das Passwort wurde auf '123456' zurückgesetzt." }
    }

    @Post('addVehicle')
    async addVehicle(@Body() data: { agentId: string; vehicleName: string; vehicleId: number }) {
        const agent = await this.databaseService.userCollection.getOneModel({ _id: new ObjectId(data.agentId) });
        if (agent == null || !agent.admin) {
            return { message: "Es ist ein Fehler unterlaufen." }
        }

        await this.databaseService.vehicleCollection.addModel(new Vehicles(data.vehicleName, data.vehicleId));

        this.logController.createLog(LogTypes.DATABASE, "Es wurde ein Fahrzeug hinzugefügt. (" + data.vehicleId + "; " + data.vehicleName + ")", agent.name);
 
        return { message: "Du hast ein Fahrzeug erfolgreich hinzugefügt." }
    }
}
