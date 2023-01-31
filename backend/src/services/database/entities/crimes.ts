import { ObjectId } from 'mongodb';

export class Crimes {
    public _id: ObjectId;
    public wantedName: string;
    public faction: string;
    public location: string;
    public dateTime: string;
    public blackMoney: { person: number; vehicle: number; house: number };
    public bankNoteCode: boolean;
    public camperLocation: string;
    public murder: boolean;
    public illegalItems: boolean;
    public proofs: { proofOne: string; proofTwo: string; proofThree: string };
    public finished: boolean;
    public agentName: string;

    constructor(
        _wantedName: string,
        _faction: string,
        _location: string,
        _dateTime: string,
        _blackMoney: { person: number; vehicle: number; house: number },
        _bankNoteCode: boolean,
        _camperLocation: string,
        _murder: boolean,
        _illegalItems: boolean,
        _proofs: { proofOne: string; proofTwo: string; proofThree: string },
        agentName: string,
    ) {
        this._id = new ObjectId();
        this.wantedName = _wantedName;
        this.faction = _faction;
        this.location = _location;
        this.dateTime = _dateTime;
        this.blackMoney = _blackMoney;
        this.bankNoteCode = _bankNoteCode;
        this.camperLocation = _camperLocation;
        this.murder = _murder;
        this.illegalItems = _illegalItems;
        this.proofs = _proofs;
        this.agentName = agentName;
    }
}
