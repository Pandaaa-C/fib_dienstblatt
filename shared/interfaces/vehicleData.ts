import { ObjectId } from 'mongodb';

export interface IVehicleData {
    _id: ObjectId;
    name: string;
    vehicleId: number;
}
