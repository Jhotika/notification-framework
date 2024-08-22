import {
  type IMongoCollectionConfig,
  MongoCollectionConfig,
  dbType as MongoCollectionDbType,
} from "./mongoCollection.config";
import {
  IInMemoryConfig,
  InMemoryConfig,
  dbType as InMemoryDbType,
} from "./inMemory.config";

// Enum representing the supported database types.
export enum DatabaseType {
  InMemory = InMemoryDbType,
  MongoDocuments = MongoCollectionDbType,
}

export interface IDatabaseConfig {
  type: DatabaseType;
  config: IMongoCollectionConfig | IInMemoryConfig | null;
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
  switch (dbConfig.type) {
    case DatabaseType.InMemory:
      InMemoryConfig.verifyConfigX(dbConfig.config as IInMemoryConfig);
      break;
    case DatabaseType.MongoDocuments:
      MongoCollectionConfig.verifyConfigX(
        dbConfig.config as IMongoCollectionConfig
      );
      break;
    default:
      throw new Error(`Database type ${dbConfig.type} is not supported`);
  }
};
