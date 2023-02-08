import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export class MockDB {
  mongo: MongoMemoryServer | undefined = undefined;

  setUp = async () => {
    this.mongo = await MongoMemoryServer.create();
    const url = this.mongo.getUri();

    await mongoose.connect(url, {
      useNewUrlParser: true,
    });
  };

  dropDatabase = async () => {
    if (this.mongo) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await this.mongo.stop();
    }
  };

  dropCollections = async () => {
    if (this.mongo) {
      const collections = mongoose.connection.collections;

      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    }
  };
}
