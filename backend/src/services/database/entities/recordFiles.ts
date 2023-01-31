import { ObjectId } from "mongodb";

export class RecordFiles {
    public _id: ObjectId;
    public fileWantedName: string;
    public wantedTeam: string;
    public dateTime: string;
    public creator: string;
    public content: string;
    public finished: boolean;

    constructor(_fileWantedName: string, _wantedTeam, _dateTime: string, _creator: string, _content: string) {
        this._id = new ObjectId();
        this.fileWantedName = _fileWantedName;
        this.dateTime = _dateTime;
        this.creator = _creator;
        this.content = _content;
        this.wantedTeam = _wantedTeam;
        this.finished = false;
    }
}