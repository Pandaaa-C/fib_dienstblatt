export interface IAgentData {
    _id: string;
    name: string;
    agentNumber: number;
    rank: number;
    admin: boolean;
    department: string;
    telefonNumber: number;
    dutyTime: number;
    entryDate: string;
    lastUprank: string;
    note: string;
    divisions: number[];
    streaming: boolean;
}
