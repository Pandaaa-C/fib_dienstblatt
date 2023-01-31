import { ObjectId } from "mongodb";

export interface IDocFileData {
    _id: string;
    fileWantedName: string;
    wantedTeam: string;
    dateTime: string;
    creator: string;
    content: string;
    finished: boolean;
}