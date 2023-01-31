import { ObjectId } from 'mongodb';

export class Vehicles {
    public _id: ObjectId;
    public name: string;
    public vehicleId: number;

    constructor(_name: string, _vehicleId: number) {
        this._id = new ObjectId();
        this.name = _name;
        this.vehicleId = _vehicleId;
    }
}
