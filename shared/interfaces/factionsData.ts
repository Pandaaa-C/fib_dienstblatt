import { ObjectId } from "mongodb";

export interface IFactionsData {
    _id: ObjectId;
    factionName: string;
    shortName: string;
}