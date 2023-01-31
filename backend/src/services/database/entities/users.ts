import { ObjectId } from 'mongodb';

export class Users {
    public _id: ObjectId;
    public uuid: string;
    public name: string;
    public password: string;
    public serviceNumber: number;
    public rank: number;
    public admin: boolean;
    public department: string;
    public telefonNumber: number;
    public dutyTime: number;
    public dutyAllTime: number;
    public entryDate: Date;
    public lastUprank: Date;
    public note: string;
    public dutySince: Date;
    public divisions: number[];

    constructor(_name: string, _password: string, _uuid: string, _serviceNumber: number, _rank: number, _phone: number) {
        this._id = new ObjectId();
        this.uuid = _uuid;
        this.name = _name;
        this.password = _password;
        this.serviceNumber = _serviceNumber;
        this.rank = _rank;
        this.admin = false;
        this.department = '';
        this.telefonNumber = _phone;
        this.dutyTime = 0;
        this.dutyAllTime = 0;
        this.entryDate = new Date();
        this.lastUprank = new Date();
        this.note = '';
        this.dutySince = new Date();
        this.divisions = [];
    }
}
