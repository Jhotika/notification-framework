import NotificationFramework from ".";
import { DatabaseType, IDatabaseConfig } from "./configs/db/database.config";
import { IInMemoryConfig } from "./configs/db/inMemory.config";
import { IMongoCollectionConfig } from "./configs/db/mongoCollection.config";
import { ILogger, Logger } from "./logger";
import type {
  AbstractNotification,
  ConcreteClass,
} from "./models/abstractNotification";

export class NotificationFrameworkBuilder {
  private logger: ILogger;
  private dbConfig: IDatabaseConfig;
  private concreteNotificationClasses: Array<
    ConcreteClass<AbstractNotification<string>>
  >;

  public withLogger(logger: ILogger): NotificationFrameworkBuilder {
    this.logger = logger;
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

  public withConcreteNotificationClasses(
    concreteNotificationClasses: Array<
      ConcreteClass<AbstractNotification<string>>
    >
  ): NotificationFrameworkBuilder {
    this.concreteNotificationClasses = concreteNotificationClasses;
    return this;
  }

  public buildX = (): NotificationFramework => {
    if (!this.logger) {
      this.logger = new Logger();
    }
    if (!this.dbConfig) {
      throw new Error("dbConfig is required");
    }
    if (
      !this.concreteNotificationClasses ||
      this.concreteNotificationClasses.length === 0
    ) {
      throw new Error("concreteNotificationClasses is required");
    }

    return NotificationFramework.getInstanceX(
      this.dbConfig,
      this.concreteNotificationClasses,
      this.logger
    );
  };
}
