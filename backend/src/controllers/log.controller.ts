import { DatabaseService } from 'src/services/database/database.service';
import { Logs } from 'src/services/database/entities/logs';
import { LogTypes } from '@shared/enums/logEnum';

export class LogController {
    constructor(private readonly databaseService: DatabaseService) {}

    async createLog(logType: LogTypes, _action: string, _initiator) {
        if (_action == null || logType < 0) return;

        const currentDateTimeString = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();
        const log = new Logs(logType, _action, currentDateTimeString, _initiator);

        this.databaseService.logCollection.addModel(log);
    }
}
