import {
  type IMongoCollectionConfig,
  MongoCollectionConfig,
  dbType as MongoCollectionDbType,
} from "./mongoCollection.config";
import {
  IMongoDbConfig,
  MongoDbConfig,
  dbType as MongoDbType,
} from "./mongoDb.config";

// Enum representing the supported database types.
export enum DatabaseType {
  MongoDB = MongoDbType,
  InMemory = "in-memory",
  MongoDocuments = MongoCollectionDbType,
}

export interface IDatabaseConfig {
  type: DatabaseType;
  config: IMongoDbConfig | IMongoCollectionConfig | null;
}

export const verifyDatabaseConfig = (
  dbConfig: IDatabaseConfig | null | undefined
): void => {
  if (!dbConfig) {
    throw new Error("Missing database configuration");
  }
  if (!dbConfig.type) {
    throw new Error("Missing database type");
  }
  if (dbConfig.type === DatabaseType.InMemory) {
    return;
  }

  if (dbConfig.type === DatabaseType.MongoDB) {
    MongoDbConfig.verifyConfigX(dbConfig.config as unknown as IMongoDbConfig);
  }

  if (dbConfig.type === DatabaseType.MongoDocuments) {
    MongoCollectionConfig.verifyConfigX(
      dbConfig.config as unknown as IMongoCollectionConfig
    );
  }
};
