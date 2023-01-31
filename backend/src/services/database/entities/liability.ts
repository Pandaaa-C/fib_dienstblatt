import { ObjectId } from 'mongodb';

export class Liability {
    public _id: ObjectId;
    public name: string;
    public jailtime: number;
    public reduction: string;
    public reason: string;
    public agent: string;

    constructor(_name: string, _jailtime: number, _reduction: string, _reason: string, _agent: string) {
        this._id = new ObjectId();
        this.name = _name;
        this.jailtime = _jailtime;
        this.reduction = _reduction;
        this.reason = _reason;
        this.agent = _agent;
    }
}
