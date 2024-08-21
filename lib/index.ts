import {
  verifyDatabaseConfig,
  DatabaseType,
  IDatabaseConfig,
} from "./configs/db/database.config";
import type { IMongoDbConfig } from "./configs/db/mongoDb.config";
import type { IMongoCollectionConfig } from "./configs/db/mongoCollection.config";
import { Errors } from "./errors";
import { Logger, type ILogger } from "./logger";
import {
  IRepository,
  RepositoryFactory,
} from "./repositories/repositoryFactory";
import { NotificationService } from "./services/notification.service";
import { UserNotificationMetadataService } from "./services/userNotificationMetadata.service";

export interface INotificationFramework {
  getNotificationServiceX: (viewerId: string) => NotificationService;
  getUserNotificationMetadataServiceX: (
    viewerId: string
  ) => UserNotificationMetadataService;
}

export class NotificationFramework implements INotificationFramework {
  /**
   * Constructs a new instance of NotificationFramework.
   * @param logger - The logger instance.
   * @param dbConfig - The database configuration.
   */

  constructor(
    private readonly logger: ILogger = new Logger(),
    private readonly dbConfig: IDatabaseConfig
  ) {
    try {
      verifyDatabaseConfig(dbConfig);
    } catch (error) {
      this.logger.error("Error initializing NotificationFramework:", error);
      throw error; // Re-throw
    }
  }

  static withMongoCollections = (
    viewerId: string,
    logger: ILogger,
    mongoCollections: IMongoCollectionConfig
  ): NotificationFramework => {
    return new NotificationFramework(logger, {
      type: DatabaseType.MongoDocuments,
      config: {
        notificationCollection: mongoCollections.notificationCollection,
        userNotificationMetadataCollection:
          mongoCollections.userNotificationMetadataCollection,
      },
    });
  };

  static withMongoDb = (
    viewerId: string,
    logger: ILogger,
    mongoConfig: IMongoDbConfig
  ): NotificationFramework => {
    return new NotificationFramework(logger, {
      type: DatabaseType.MongoDB,
      config: mongoConfig,
    });
  };

  /**
   * Gets the NotificationService instance.
   * @returns A NotificationService instance.
   */
  getNotificationServiceX = (viewerId: string): NotificationService => {
    try {
      const repository: IRepository = RepositoryFactory.getRepositoryX(
        viewerId,
        this.dbConfig
      );
      return new NotificationService(
        viewerId,
        repository.notificationRepository,
        repository.userNotificationMetadataRepository,
        this.logger
      );
    } catch (error) {
      this.logger.error("Error initializing NotificationFramework:", error);
      throw error; // Re-throw
    }
  };

  /**
   * Gets the UserNotificationMetadataService instance.
   * @returns A UserNotificationMetadataService instance.
   */
  getUserNotificationMetadataServiceX = (
    viewerId: string
  ): UserNotificationMetadataService => {
    try {
      const repository: IRepository = RepositoryFactory.getRepositoryX(
        viewerId,
        this.dbConfig
      );
      return new UserNotificationMetadataService(
        viewerId,
        repository.userNotificationMetadataRepository,
        this.logger
      );
    } catch (error) {
      this.logger.error("Error initializing NotificationFramework:", error);
      throw error; // Re-throw
    }
  };
}

export default NotificationFramework;
export { Errors, DatabaseType };
