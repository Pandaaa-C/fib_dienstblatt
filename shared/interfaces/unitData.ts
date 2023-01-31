import { ObjectId } from 'mongodb';
import { IAgentData } from './agentData';

export interface IUnitData {
    _id: ObjectId;
    name: string;
    activity: number;
    vehicle: number;
    agents: IAgentData[];
}
