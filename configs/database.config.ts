// Enum representing the supported database types.
export enum DatabaseType {
  MongoDB = "mongodb",
  InMemory = "in-memory",
}

interface MongoConfig {
  user: string;
  password: string;
  clusterUri: string;
  db: string;
}

export interface DatabaseConfig {
  type: DatabaseType;
  config: MongoConfig | null;
}

export const verifyDatabaseConfig = (config: DatabaseConfig): void => {
  if (config.type === DatabaseType.MongoDB) {
    if (!config.config) {
      throw new Error("Missing MongoDB configuration");
    }
    if (
      !config.config.user ||
      !config.config.password ||
      !config.config.clusterUri ||
      !config.config.db
    ) {
      throw new Error("Missing MongoDB configuration details");
    }
  }
};
