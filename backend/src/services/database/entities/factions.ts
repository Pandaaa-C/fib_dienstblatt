import { ObjectId } from 'mongodb';

export class Factions {
    public _id: ObjectId;
    public factionName: string;
    public shortName: string;

    constructor(_factionName: string, _shortName: string) {
        this._id = new ObjectId();
        this.factionName = _factionName;
        this.shortName = _shortName;
    }
}
