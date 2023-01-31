import { Injectable } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { Factions, Info, Units, Users, Vehicles } from './entities';
import { NetCollection } from './classes/netCollection';
import { Crimes } from './entities/crimes';
import { RecordFiles } from './entities/recordFiles';
import { Logs } from './entities/logs';
import {Liability} from "./entities/liability";

@Injectable()
export class DatabaseService {
    private client: MongoClient;
    private database: Db;
    private initialized: boolean = false;

    public userCollection: NetCollection<Users>;
    public vehicleCollection: NetCollection<Vehicles>;
    public infoCollection: NetCollection<Info>;
    public unitCollection: NetCollection<Units>;
    public crimesCollection: NetCollection<Crimes>;
    public recordFilesCollection: NetCollection<RecordFiles>;
    public logCollection: NetCollection<Logs>;
    public factionsCollection: NetCollection<Factions>;
    public liabilityCollection: NetCollection<Liability>;

    constructor() {
        this.client = new MongoClient(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017');

        this.client.connect(err => {
            if (err) {
                console.error('Error connecting to database: ', err);
            } else {
                this.database = this.client.db('n_copnet');
                this.initialized = true;

                this.userCollection = new NetCollection(this.database.collection('users'));
                this.vehicleCollection = new NetCollection(this.database.collection('vehicles'));
                this.infoCollection = new NetCollection(this.database.collection('info'));
                this.unitCollection = new NetCollection(this.database.collection('units'));
                this.crimesCollection = new NetCollection(this.database.collection('crimes'));
                this.recordFilesCollection = new NetCollection(this.database.collection('record_files'));
                this.logCollection = new NetCollection(this.database.collection('logs'));
                this.factionsCollection = new NetCollection(this.database.collection('factions'));
                this.liabilityCollection = new NetCollection(this.database.collection('liability_reductions'));
            }
        });
    }
}
