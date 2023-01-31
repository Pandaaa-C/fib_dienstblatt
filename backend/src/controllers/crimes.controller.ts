import { Body, Controller, Get, Post } from '@nestjs/common';
import { DatabaseService } from 'src/services/database/database.service';
import { CrimesGateway } from 'src/gateways/crimes.gateway';
import { ICrimesData } from '@shared/interfaces';
import { Crimes } from 'src/services/database/entities';
import { ObjectId } from 'mongodb';
import { LogController } from './log.controller';
import { LogTypes } from '@shared/enums/logEnum';

@Controller('crimes')
export class CrimesController {
    private logController: LogController = new LogController(this.databaseService);
    constructor(private readonly databaseService: DatabaseService, private readonly crimesGateway: CrimesGateway) {}

    @Post('addCrime')
    async addCrime(
        @Body()
        data: {
            name: string;
            team: string;
            location: string;
            blackMoneyPerson: number;
            blackMoneyVehicle: number;
            blackMoneyHouse: number;
            bnc: boolean;
            camper: string;
            mord: boolean;
            illegalItems: boolean;
            proof1: string;
            proof2: string;
            proof3: string;
            agentName: string;
        },
    ) {
        const crime = await this.databaseService.crimesCollection.addModelWithReturn(
            new Crimes(
                data.name,
                data.team,
                data.location,
                new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
                {
                    person: data.blackMoneyPerson != null ? data.blackMoneyPerson : 0,
                    vehicle: data.blackMoneyVehicle != null ? data.blackMoneyVehicle : 0,
                    house: data.blackMoneyHouse != null ? data.blackMoneyHouse : 0,
                },
                data.bnc,
                data.camper,
                data.mord,
                data.illegalItems,
                { proofOne: data.proof1, proofTwo: data.proof2, proofThree: data.proof3 },
                data.agentName,
            ),
        );

        this.logController.createLog(LogTypes.CRIMES, "Es wurde eine neue Crime-Akte erstellt (" + crime._id + ").", data.agentName);

        this.updateCrimes();

        return { message: 'Du hast erfolgreich eine Akte erstellt.' };
    }

    @Post('updateCrime')
    async updateCrime(@Body() data: { initiator: string, crimeId: string }) {
        const crime = await this.databaseService.crimesCollection.getOneModel({ _id: new ObjectId(data.crimeId) });
        if (crime == null) {
            this.updateCrimes();
            return { message: 'Es ist ein Fehler unterlaufen' };
        }

        if (crime.finished) {
            this.updateCrimes();
            return { message: 'Die Akte ist bereits geschlossen.' };
        }

        await this.databaseService.crimesCollection.updateModel(
            { _id: new ObjectId(data.crimeId) },
            {
                $set: {
                    finished: true,
                },
            },
        );

        this.logController.createLog(LogTypes.CRIMES, "Es wurde eine Crime-Akte geschlossen (" + crime._id + ").", data.initiator);

        this.updateCrimes();

        return { message: 'Du hast die Akte erfolgreich geschlossen.' };
    }

    async updateCrimes() {
        const crimes = await this.databaseService.crimesCollection.getAllModels();

        this.crimesGateway.emit('initiliazeCrimes', crimes);
    }
}
