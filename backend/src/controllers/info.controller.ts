/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { LogTypes } from '@shared/enums/logEnum';
import { ObjectId } from 'mongodb';
import { InfoGateway } from 'src/gateways/info.gateway';
import { DatabaseService } from 'src/services/database/database.service';
import { LogController } from './log.controller';

@Controller('info')
export class InfoController {
    private logController: LogController = new LogController(this.databaseService);

    constructor(private readonly databaseService: DatabaseService, private readonly infoGateway: InfoGateway) {}

    @Post('takeOverLeitstelle')
    async takeOverLeitstelle(@Body() data: { agentId: string }) {
        const agent = await this.databaseService.userCollection.getOneModel({ _id: new ObjectId(data.agentId) });
        if (agent == null) return { message: 'Es ist ein unerwarteter Fehler aufgetreten.' };

        const currentLeitstelle = await this.databaseService.infoCollection.getOneModel({});

        if (currentLeitstelle.leitstelle == agent.name) {
            await this.databaseService.infoCollection.updateModel({}, { $set: { leitstelle: '' } });

            await this.infoGateway.emit('updateLeitstelle', '');
            await this.logController.createLog(LogTypes.INFORMATION, 'Leitstelle wurde freigegeben.', agent.name);

            return { message: 'Leitstelle erfolgreich freigegeben.' };
        } else {
            await this.databaseService.infoCollection.updateModel({}, { $set: { leitstelle: agent.name } });

            await this.infoGateway.emit('updateLeitstelle', agent.name);
            await this.logController.createLog(LogTypes.INFORMATION, 'Leitstelle wurde übernommen.', agent.name);

            return { message: 'Leitstelle erfolgreich übernommen.' };
        }
    }

    @Post('updateDefconLevel')
    async updateDefconLevel(@Body() data: { initator: string; defcon: number }) {
        await this.databaseService.infoCollection.updateModel({}, { $set: { defcon: data.defcon } });

        await this.infoGateway.emit('updateDefcon', data.defcon);
        await this.logController.createLog(LogTypes.INFORMATION, 'Das Defcon-Level wurde überarbeitet (' + data.defcon + ').', data.initator);

        return { message: 'Defcon-Stufe auf ' + data.defcon + ' geändert!' };
    }

    @Post('updateFunkCode')
    async updateFunkCode(@Body() data: { initator: string; funk: number }) {
        await this.databaseService.infoCollection.updateModel({}, { $set: { funk: data.funk } });

        await this.infoGateway.emit('updateFunkCode', data.funk);
        await this.logController.createLog(LogTypes.INFORMATION, 'Der Funk-Status wurde überarbeitet (' + data.funk + ').', data.initator);

        return { message: 'Funk-Code auf ' + data.funk + ' geändert!' };
    }

    @Post('updateGeneralInfo')
    async updateGeneralInfo(@Body() data: { initator: string; message: string }) {
        await this.databaseService.infoCollection.updateModel({}, { $set: { globalInfo: data.message } });

        await this.infoGateway.emit('updateInfo', data.message);
        await this.logController.createLog(LogTypes.INFORMATION, 'Die General-Info wurde überarbeitet.', data.initator);

        return { message: 'Information geändert!' };
    }

    @Post('initializeActiveOperationOfficers')
    async initializeActiveOperationOfficers(@Body() data: { lspd: string; swat: string; swatstatus: string }) {
        const lspd = parseInt(data.lspd);
        const swat = parseInt(data.swat);

        await this.infoGateway.emit('updateOperationCount', { lspd: lspd, swat: swat, swatStatus: data.swatstatus });

        return data;
    }
}
