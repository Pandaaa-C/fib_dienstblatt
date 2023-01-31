import { Body, Controller, Get, Post } from '@nestjs/common';
import { DatabaseService } from 'src/services/database/database.service';
import { ObjectId } from 'mongodb';
import { DocGateway } from 'src/gateways/doc.gateway';
import { RecordFiles } from 'src/services/database/entities/recordFiles';
import { LogController } from './log.controller';
import { LogTypes } from '@shared/enums/logEnum';

@Controller('doc')
export class DocController {
    private logController: LogController = new LogController(this.databaseService);
    constructor(private readonly databaseService: DatabaseService, private readonly docGateway: DocGateway) {}

    @Post('addFile')
    async updateCrime(@Body() data: { agentId: string; fileWantedName: string; wantedNameTeam: string; content: string }) {
        const agent = await this.databaseService.userCollection.getOneModel({ _id: new ObjectId(data.agentId) });
        if (agent == null) {
            return { message: "Es ist ein Fehler unterlaufen!" }
        }

        const recordFile = new RecordFiles(data.fileWantedName, data.wantedNameTeam, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), agent.name, data.content);
        if (!recordFile) {
            return { message: "Es ist ein Fehler beim erstellen der Akte unterlaufen!" }
        }

        await this.databaseService.recordFilesCollection.addModel(recordFile);
        this.updateRecords();

        this.logController.createLog(LogTypes.RECORD_FILES, "Es wurde eine Neue Record-Akte erstellt. (" + recordFile._id + ")", agent.name);

        return { message: "Du hast eine Akte erstellt." }
    }

    @Post('updateFile')
    async updateFile(@Body() data: { recordId: string; agentId: string; }) {
        const agent = await this.databaseService.userCollection.getOneModel({ _id: new ObjectId(data.agentId) });
        if (agent == null || !agent.admin) {
            return { message: "Es ist ein Fehler mit deinen Benutzerkonten unterlaufen." }
        }
        
        const file = await this.databaseService.recordFilesCollection.getOneModel({ _id: new ObjectId(data.recordId) });
        if (file == null) {
            return { message: "Es existiert kein Akten Eintrag mit diesen Daten." }
        }

        if (file.finished) {
            this.updateRecords();
            return { message: "Diese Akte ist bereits geschlossen." }
        }

        await this.databaseService.recordFilesCollection.updateModel({ _id: new ObjectId(data.recordId) }, { 
            $set: {
                finished: true
            } 
        });

        this.updateRecords();
        this.logController.createLog(LogTypes.RECORD_FILES, "Es wurde eine Record-Akte geschlossen. (" + file._id + ")", agent.name);

        return { message: "Du hast die Akte erfolgreich geschlossen." }
    }

    async updateRecords() {
        const records = await this.databaseService.recordFilesCollection.getAllModels();

        this.docGateway.emit("initializeDocFiles", records);
    }
}
