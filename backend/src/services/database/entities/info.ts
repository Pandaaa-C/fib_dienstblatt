import { ObjectId } from 'mongodb';

export class Info {
    public _id: ObjectId;
    public globalInfo: string;
    public defcon: number;
    public leitstelle: string;
    public funk: number;

    constructor(_globalInfo: string, _defcon: number, _leitstelle: string, _funk: number) {
        this._id = new ObjectId();
        this.globalInfo = _globalInfo;
        this.defcon = _defcon;
        this.leitstelle = _leitstelle;
        this.funk = _funk;
    }
}
