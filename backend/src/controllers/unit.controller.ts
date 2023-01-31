import { Body, Controller, Get, Post } from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { IAgentData, IUnitData } from '@shared/interfaces';
import { DatabaseService } from 'src/services/database/database.service';
import { Units } from 'src/services/database/entities';
import { ObjectId } from 'mongodb';
import { UnitGateway } from 'src/gateways/unit.gateway';
import { LogController } from './log.controller';
import { LogTypes } from '@shared/enums/logEnum';

@Controller('units')
export class UnitController {
    private logController: LogController = new LogController(this.databaseService);

    constructor(private readonly databaseService: DatabaseService, private readonly unitGateway: UnitGateway) {}

    @Get('units')
    async getUnits() {
        return await this.databaseService.unitCollection.getAllModels();
    }

    @Post('addUnit')
    async addUnit(@Body() unitData: { unitName: string; initiator: string }) {
        const unit = await this.databaseService.unitCollection.getOneModel({
            name: unitData.unitName,
        });

        if (unit) return { message: 'Einheit konnte nicht erstellt werden, da eine Einheit mit diesen Namen bereits exestiert!' };

        const newUnit = new Units(unitData.unitName, -1, -1, []);
        await this.databaseService.unitCollection.addModel(newUnit);
        await this.unitGateway.emit('addUnit', newUnit);

        this.logController.createLog(
            LogTypes.UNIT,
            'Es wurde eine Einheit erstellt. (' + unitData.unitName + ', ' + newUnit._id + ')',
            unitData.initiator,
        );

        return { message: 'Einheit wurde erfolgreich erstellt!' };
    }

    @Post('updateUnitEssentials')
    async updateUnitEssentials(@Body() unitData: { initiator: string; unitId: string; newName: string }) {
        const unit = await this.databaseService.unitCollection.getOneModel({
            _id: new ObjectId(unitData.unitId),
        });

        if (!unit) return { message: 'Die Einheit wurde nicht gefunden!' };

        await this.databaseService.unitCollection.updateModel(
            { _id: new ObjectId(unitData.unitId) },
            {
                $set: {
                    name: unitData.newName,
                },
            },
        );
        unit.name = unitData.newName;

        this.logController.createLog(
            LogTypes.UNIT,
            'Es wurde eine Einheit umbenannt. (' + unitData.newName + ', ' + unitData.unitId + ')',
            unitData.initiator,
        );

        await this.unitGateway.emit('updateUnit', unit);

        return { message: 'Die Einheit wurde umbenannt!' };
    }

    @Delete('deleteUnit')
    async deleteUnit(@Body() unitData: { unitId: string; initiator: string }) {
        const unit = await this.databaseService.unitCollection.getOneModel({
            _id: new ObjectId(unitData.unitId),
        });

        if (!unit) return { message: 'Einheit konnte nicht gelöscht werden, da keine Einheit mit diesen Namen exestiert!' };

        await this.databaseService.unitCollection.deleteModelById(new ObjectId(unitData.unitId));
        await this.unitGateway.emit('deleteUnit', unitData.unitId);

        unit.agents.forEach(async _agent => {
            const agent = await this.databaseService.userCollection.getOneModel({ name: _agent.name });
            if (agent == null) return;

            let dutyTimeInMinutes = this.getTimeDifference(agent.dutySince, new Date());

            await this.databaseService.userCollection.updateModel(
                { _id: agent._id },
                {
                    $set: {
                        dutyAllTime: (agent.dutyAllTime += dutyTimeInMinutes),
                        dutyTime: (agent.dutyTime += dutyTimeInMinutes),
                    },
                },
            );
        });

        this.logController.createLog(
            LogTypes.UNIT,
            'Es wurde eine Einheit gelöscht. (' + unit.name + ', ' + unitData.unitId + ')',
            unitData.initiator,
        );

        return { message: 'Einheit wurde erfolgreich gelöscht!' };
    }

    @Post('updateUnit')
    async updateUnit(@Body() unitData: { _id: string; unitActivity: number; unitVehicle: number; initiator: string }) {
        const unit = await this.databaseService.unitCollection.getOneModel({
            _id: new ObjectId(unitData._id),
        });

        if (!unit) return { message: 'Einheit konnte nicht aktualisiert werden, da keine Einheit mit diesen Namen exestiert!' };

        await this.databaseService.unitCollection.updateModel(
            { _id: new ObjectId(unitData._id) },
            {
                $set: {
                    activity: unitData.unitActivity,
                    vehicle: unitData.unitVehicle,
                },
            },
        );
        unit.activity = unitData.unitActivity;
        unit.vehicle = unitData.unitVehicle;

        await this.unitGateway.emit('updateUnit', unit);

        this.logController.createLog(
            LogTypes.UNIT,
            'Es wurde eine Einheit geändert. (' + unit.name + ', ' + unitData._id + ')',
            unitData.initiator,
        );

        return { message: 'Einheit wurde erfolgreich aktualisiert!' };
    }

    @Post('addAgentToUnit')
    async addAgentToUnit(@Body() unitData: { initiator: string; unitId: string; agentName: string; agentId: string; agentLive: boolean }) {
        const unit = await this.databaseService.unitCollection.getOneModel({
            _id: new ObjectId(unitData.unitId),
        });

        if (!unit) return { message: 'Agent konnte nicht der Einheit hinzugefügt werden, da keine Einheit mit diesen Namen exestiert!' };
        if (unit.agents.length >= 4)
            return { message: 'Agent konnten nicht der Einheit hinzugefügt werden, da die Einheit bereits voll ist!' };

        let agent: IAgentData | any = undefined;

        if (this.isNumber(unitData.agentName)) {
            agent = await this.databaseService.userCollection.getOneModel({
                serviceNumber: parseInt(unitData.agentName),
            });
        } else {
            agent = await this.databaseService.userCollection.getOneModel({
                name: unitData.agentName,
            });
        }

        if (!agent) return { message: 'Agent konnte nicht der Einheit hinzugefügt werden, da kein Agent mit diesen Namen exestiert!' };

        if (await this.isInUnit(agent)) {
            return { message: 'Agent konnten nicht der Einheit hinzugefügt werden, da er bereits in einer Einheit ist!' };
        }

        await this.databaseService.unitCollection.updateModel(
            { _id: new ObjectId(unitData.unitId) },
            {
                $push: {
                    agents: {
                        _id: agent.name,
                        name: agent.name,
                        rank: agent.rank,
                        agentNumber: agent.serviceNumber,
                        telefonNumber: (agent as IAgentData).telefonNumber,
                        streaming: unitData.agentLive,
                    } as IAgentData,
                },
            },
        );

        await this.databaseService.userCollection.updateModel(
            { _id: new ObjectId(agent._id) },
            {
                $set: {
                    dutySince: new Date(),
                },
            },
        );

        this.unitGateway.emit('addAgentToUnit', {
            unitId: unitData.unitId,
            agent: {
                _id: agent.name,
                name: agent.name,
                rank: agent.rank,
                agentNumber: agent.serviceNumber,
                telefonNumber: (agent as IAgentData).telefonNumber,
                streaming: unitData.agentLive,
            },
        });

        this.logController.createLog(
            LogTypes.UNIT,
            'Es wurde ein Agent zu einer Einheit hinzugefügt. (' + unit.name + ', ' + agent.name + ')',
            unitData.initiator,
        );

        return { message: 'Agent wurde erfolgreich der Einheit hinzugefügt!' };
    }

    @Delete('removeAgentFromUnit')
    async removeAgentFromUnit(@Body() unitData: { initiator: string; unitId: string; agentName: string; agentId: string }) {
        const unit = await this.databaseService.unitCollection.getOneModel({
            _id: new ObjectId(unitData.unitId),
        });

        const agent = await this.databaseService.userCollection.getOneModel({
            name: unitData.agentName,
        });
        if (agent == null) {
            return { message: 'Es ist ein Fehler unterlaufen! Es gibt keinen Agent mit dem Namen' };
        }

        if (!unit) return { message: 'Agent konnte nicht aus der Einheit entfernt werden, da keine Einheit mit diesen Namen exestiert!' };
        if (
            !(await this.databaseService.unitCollection.getOneModel({ _id: new ObjectId(unitData.unitId) })).agents.find(
                x => x.name == unitData.agentName,
            )
        )
            return { message: 'Agent konnte nicht aus der Einheit entfernt werden, da der Agent nicht in der Einheit ist!' };

        await this.databaseService.unitCollection.updateModel(
            { _id: new ObjectId(unitData.unitId) },
            {
                $pull: {
                    agents: {
                        name: unitData.agentName,
                    },
                },
            },
        );

        let dutyTimeInMinutes = this.getTimeDifference(agent.dutySince, new Date());

        await this.databaseService.userCollection.updateModel(
            { _id: agent._id },
            {
                $set: {
                    dutyAllTime: (agent.dutyAllTime += dutyTimeInMinutes),
                    dutyTime: (agent.dutyTime += dutyTimeInMinutes),
                },
            },
        );

        this.logController.createLog(
            LogTypes.UNIT,
            'Es wurde ein Agent zu einer Einheit rausgelöscht. (' + unit.name + ', ' + agent.name + ')',
            unitData.initiator,
        );

        this.unitGateway.emit('removeAgentFromUnit', { unitId: unitData.unitId, agentName: unitData.agentName });
        return { message: 'Agent wurde erfolgreich aus der Einheit entfernt!' };
    }

    @Get('getActiveOperationAgents')
    async getActiveOperationAgents() {
        let count = 0;

        const units = await this.databaseService.unitCollection.getAllModels();

        units.forEach(unit => {
            if (unit.activity == 2) {
                count += unit.agents.length;
            }
        });

        return count;
    }

    private isNumber(n) {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    }

    async isInUnit(agentData: IAgentData): Promise<boolean> {
        const units: IUnitData[] = await this.databaseService.unitCollection.getAllModels();

        return units.find(unit => unit.agents.find(agent => agent.name == agentData.name)) != null;
    }

    private getTimeDifference(date: Date, date2: Date): number {
        let diff = (date2.getTime() - date.getTime()) / 1000;
        diff /= 60;

        return Math.abs(Math.round(diff));
    }
}
