import NotificationFramework from ".";
import { DatabaseType, IDatabaseConfig } from "./configs/db/database.config";
import { IInMemoryConfig } from "./configs/db/inMemory.config";
import { IMongoCollectionConfig } from "./configs/db/mongoCollection.config";
import { IMongoDbConfig } from "./configs/db/mongoDb.config";
import { ILogger, Logger } from "./logger";

export class NotificationFrameworkBuilder {
  private viewerId: string;
  private logger: ILogger;
  private dbConfig: IDatabaseConfig;

  public withViewerId(viewerId: string): NotificationFrameworkBuilder {
    this.viewerId = viewerId;
    return this;
  }

  public withLogger(logger: ILogger): NotificationFrameworkBuilder {
    this.logger = logger;
    return this;
  }

  public withMongoDbConfig(
    config: IMongoDbConfig
  ): NotificationFrameworkBuilder {
    this.dbConfig = {
      type: DatabaseType.MongoDB,
      config,
    };
    return this;
  }

  public withMongoCollectionConfig(
    config: IMongoCollectionConfig
  ): NotificationFrameworkBuilder {
    this.dbConfig = {
      type: DatabaseType.MongoDocuments,
      config,
    };
    return this;
  }

  public withInMemoryDbConfig(
    config: IInMemoryConfig
  ): NotificationFrameworkBuilder {
    this.dbConfig = {
      type: DatabaseType.InMemory,
      config,
    };
    return this;
  }

  public build(): NotificationFramework {
    if (!this.viewerId) {
      throw new Error("viewerId is required");
    }
    if (!this.logger) {
      this.logger = new Logger();
    }
    if (!this.dbConfig) {
      throw new Error("dbConfig is required");
    }

    return new NotificationFramework(this.viewerId, this.logger, this.dbConfig);
  }
}
