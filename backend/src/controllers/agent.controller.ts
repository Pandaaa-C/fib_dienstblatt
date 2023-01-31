/*
https://docs.nestjs.com/controllers#controllers
*/

import { Response } from 'express';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { IAgentData } from '@shared/interfaces';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { ObjectId } from 'mongodb';
import { AgentGateway } from 'src/gateways/agent.gateway';
import { DatabaseService } from 'src/services/database/database.service';
import { Users } from 'src/services/database/entities';
import { LogController } from './log.controller';
import { LogTypes } from '@shared/enums/logEnum';

@Controller('agent')
export class AgentController {
    private logController: LogController = new LogController(this.databaseService);
    
    constructor(private readonly databaseService: DatabaseService, private readonly agentGateway: AgentGateway) {}

    @Post('addAgent')
    async addAgent(@Body() data: { initiator: string; agentName: string; agentRank: number; agentDN: string; agentPhone: string }) {
        if (await this.accountExists(data.agentName)) {
            return { message: 'Es existiert bereit ein Account unter diesen Namen!' };
        }

        const agent = new Users(
            data.agentName,
            await hash('123456', 10),
            randomUUID(),
            parseInt(data.agentDN),
            data.agentRank,
            parseInt(data.agentPhone),
        );
        await this.databaseService.userCollection.addModel(agent);
        this.updateAgentList();
        this.logController.createLog(LogTypes.USER, "Neuen Agenten hinzugefügt.", data.initiator);

        return { message: 'Der Account wurde erfolgreich erstellt!' };
    }

    @Delete('deleteAgent')
    async deleteAgent(@Body() data: { initiator: string, agentId: string }) {
        const agent = await this.databaseService.userCollection.getOneModel({ _id: new ObjectId(data.agentId) });
        if (agent == null) {
            return { message: 'Es ist ein Fehler unterlaufen!' };
        }

        await this.databaseService.userCollection.deleteModelById(new ObjectId(data.agentId));
        this.agentGateway.emit('deleteAgent', data.agentId);
        
        this.logController.createLog(LogTypes.USER, "Agent gelöscht. (" + data.agentId + ")", data.initiator);

        return { message: 'Der Agent wurde erfolgreich gelöscht' };
    }

    @Post('updateAgent')
    async updateAgent(@Body() data: { initiator: string; agentData: IAgentData }) {
        const agent = await this.databaseService.userCollection.getOneModel({ _id: new ObjectId(data.agentData._id) });
        if (agent == null) {
            return { message: 'Es ist ein Fehler unterlaufen!' };
        }

        if (data.agentData.rank != agent.rank) {
            await this.databaseService.userCollection.updateModel(
                { _id: new ObjectId(data.agentData._id) },
                {
                    $set: {
                        admin: data.agentData.admin,
                        department: data.agentData.department,
                        note: data.agentData.note,
                        rank: data.agentData.rank,
                        serviceNumber: data.agentData.agentNumber,
                        telefonNumber: data.agentData.telefonNumber,
                        lastUprank: new Date(),
                        divisions: data.agentData.divisions,
                    },
                },
            );
        } else {
            await this.databaseService.userCollection.updateModel(
                { _id: new ObjectId(data.agentData._id) },
                {
                    $set: {
                        admin: data.agentData.admin,
                        department: data.agentData.department,
                        note: data.agentData.note,
                        rank: data.agentData.rank,
                        serviceNumber: data.agentData.agentNumber,
                        telefonNumber: data.agentData.telefonNumber,
                        divisions: data.agentData.divisions,
                    },
                },
            );
        }

        this.agentGateway.emit('updateAgent', data.agentData);


        this.logController.createLog(LogTypes.USER, agent.name + " hat einen Informations Update bekommen.", data.initiator);

        return { message: 'Du hast die Information von dem Agent geändert.' };
    }

    @Post('changePassword')
    async changePassword(@Res({ passthrough: true }) response: Response, @Body() data: { agentId: string; password: string; }) {
        const agent = await this.databaseService.userCollection.getOneModel({ _id: new ObjectId(data.agentId) });
        if (agent == null) {
            return { message: 'Es ist ein Fehler unterlaufen.' };
        }

        await this.databaseService.userCollection.updateModel(
            { _id: new ObjectId(data.agentId) },
            {
                $set: {
                    password: await hash(data.password, 10),
                },
            },
        );

        response.clearCookie('login_token');

        this.logController.createLog(LogTypes.USER, "Passwort geändert.", agent.name);

        return { message: 'Passwort erfolgreich geändert.' }
    }

    private async accountExists(agentName: string): Promise<boolean> {
        return (await this.databaseService.userCollection.getOneModel({ name: agentName })) != null;
    }

    private async updateAgentList(): Promise<void> {
        const users = await this.databaseService.userCollection.getAllModels();
        let agents: IAgentData[] = [];

        users.forEach(user => {
            agents.push({
                _id: user._id.toString(),
                admin: user.admin,
                agentNumber: user.serviceNumber,
                department: user.department,
                dutyTime: user.dutyTime,
                entryDate: user.entryDate.toLocaleDateString(),
                lastUprank: user.lastUprank.toLocaleDateString(),
                name: user.name,
                note: user.note,
                rank: user.rank,
                telefonNumber: user.telefonNumber,
                divisions: user.divisions,
                streaming: false
            });
        });

        this.agentGateway.emit('initializeAgents', agents);
    }
}
