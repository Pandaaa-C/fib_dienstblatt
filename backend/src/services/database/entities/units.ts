import { ObjectId } from 'mongodb';
import { IAgentData } from '@shared/interfaces/agentData';

export class Units {
    public _id: ObjectId;
    public name: string;
    public activity: number;
    public vehicle: number;
    public agents: IAgentData[];

    constructor(_name: string, _activity: number, _vehicle: number, _agents: IAgentData[]) {
        this._id = new ObjectId();
        this.name = _name;
        this.activity = _activity;
        this.vehicle = _vehicle;
        this.agents = _agents;
    }
}
