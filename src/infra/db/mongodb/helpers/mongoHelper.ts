import { MongoClient } from 'mongodb';

export const MongoHelper = {
  client: MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
  async disconnect(): Promise<void> {
    await this.client.close();
  },
};
