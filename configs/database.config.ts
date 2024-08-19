import { Collection } from "mongodb";
import { AbstractNotification } from "../lib/models/abstractNotification";

// Enum representing the supported database types.
export enum DatabaseType {
  MongoDB = "mongodb",
  InMemory = "in-memory",
  MongoDocuments = "mongo-documents",
}

export interface MongoDbConfig {
  user: string;
  password: string;
  clusterUri: string;
  db: string;
}

export interface MongoCollectionConfig {
  notificationCollection: Collection<AbstractNotification<string>>;
  userNotificationMetadataCollection: Collection;
}

export interface DatabaseConfig {
  type: DatabaseType;
  config: MongoDbConfig | MongoCollectionConfig | null;
}

export const verifyDatabaseConfig = (
  dbConfig: DatabaseConfig | null | undefined
): void => {
  if (!dbConfig) {
    throw new Error("Missing database configuration");
  }

  if (dbConfig.type === DatabaseType.MongoDB) {
    if (!dbConfig.config) {
      throw new Error("Missing MongoDB dbConfig.configuration");
    }
    const config = dbConfig.config as MongoDbConfig;
    if (!config) {
      throw new Error("Missing MongoDB configuration");
    }
    if (!config.user || !config.password || !config.clusterUri || !config.db) {
      throw new Error("Missing MongoDB configuration details");
    }
  }

  if (dbConfig.type === DatabaseType.MongoDocuments) {
    const { config } = dbConfig;
    if (!config) {
      throw new Error("Missing MongoDB dbConfig.configuration");
    }
    const mongoCollectionConfig = config as MongoCollectionConfig;
    if (!mongoCollectionConfig) {
      throw new Error("Missing MongoDB collection configuration");
    }
    if (
      !mongoCollectionConfig.notificationCollection ||
      !mongoCollectionConfig.userNotificationMetadataCollection
    ) {
      throw new Error("Missing MongoDB collection names");
    }
  }
};
