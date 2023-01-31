import { LogTypes } from '@shared/enums/logEnum';
import { ObjectId } from 'mongodb';

export class Logs {
    public _id: ObjectId;
    public logType: LogTypes;
    public action: string;
    public dateTime: string;
    public initiator: string;

    constructor(_logType: LogTypes, _action: string, _dateTime: string, _initiator: string) {
        this._id = new ObjectId();
        this.logType = _logType;
        this.action = _action;
        this.dateTime = _dateTime;
        this.initiator = _initiator;
    }
}
