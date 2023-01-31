import { Collection, Filter, ObjectId, OptionalUnlessRequiredId, UpdateFilter } from 'mongodb';

export class NetCollection<T> {
    private collection: Collection<T>;

    constructor(collection: Collection<T>) {
        this.collection = collection;
    }

    public async getOneModel(filter: Filter<T> = {}): Promise<T> {
        return await this.collection.findOne<T>(filter);
    }

    public async getAllModels(): Promise<T[]> {
        return await this.collection.find<T>({}).toArray();
    }

    public async addModel(document: OptionalUnlessRequiredId<T>) {
        await this.collection.insertOne(document);
    }

    public async addModelWithReturn(document: OptionalUnlessRequiredId<T>): Promise<T> {
        return await this.collection.insertOne(document) as T;
    }

    public async updateModel(filter: Filter<T>, updateFilter: UpdateFilter<T>) {
        await this.collection.updateOne(filter, updateFilter);
    }

    public async deleteModelById(id: ObjectId) {
        await this.collection.deleteOne({ _id: id } as unknown as Filter<T>);
    }
}
