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

/**
 * NotificationFramework is a singleton class that provides access to
 * the NotificationService and UserNotificationMetadataService.
 */

export class NotificationFramework implements INotificationFramework {
  /**
   * Constructs a new instance of NotificationFramework.
   * @param logger - The logger instance.
   * @param dbConfig - The database configuration.
   */

  private static instance: NotificationFramework | null = null;

  private constructor(
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

  static getInstanceX = (
    logger: ILogger,
    dbConfig: IDatabaseConfig
  ): NotificationFramework => {
    if (!this.instance) {
      this.instance = new NotificationFramework(logger, dbConfig);
    } else {
      if (this.instance.dbConfig !== dbConfig) {
        throw new Error(
          "Cannot instantiate multiple instances of NotificationFramework with different configurations., current instance configuration: " +
            this.instance.dbConfig +
            ", new instance configuration: " +
            dbConfig
        );
      }
    }
    return this.instance;
  };

  static withMongoCollections = (
    logger: ILogger,
    mongoCollections: IMongoCollectionConfig
  ): NotificationFramework => {
    return NotificationFramework.getInstanceX(logger, {
      type: DatabaseType.MongoDocuments,
      config: {
        notificationCollection: mongoCollections.notificationCollection,
        userNotificationMetadataCollection:
          mongoCollections.userNotificationMetadataCollection,
      },
    });
  };

  static withMongoDb = (
    logger: ILogger,
    mongoConfig: IMongoDbConfig
  ): NotificationFramework => {
    return NotificationFramework.getInstanceX(logger, {
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
      this.logger.error("Error fetching NotificationService:", error);
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
      this.logger.error(
        "Error fetching UserNotificationMetadataService:",
        error
      );
      throw error; // Re-throw
    }
  };
}

export default NotificationFramework;
export { Errors, DatabaseType };
