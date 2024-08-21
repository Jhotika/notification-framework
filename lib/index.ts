import {
  verifyDatabaseConfig,
  DatabaseType,
  IDatabaseConfig,
} from "./configs/db/database.config";
import type { IMongoDbConfig } from "./configs/db/mongoDb.config";
import type { IMongoCollectionConfig } from "./configs/db/mongoCollection.config";
import { Errors } from "./errors";
import { Logger, type ILogger } from "./logger";
import { RepositoryFactory } from "./repositories/repositoryFactory";
import { NotificationService } from "./services/notification.service";
import { UserNotificationMetadataService } from "./services/userNotificationMetadata.service";

export interface INotificationFramework {
  notificationService: NotificationService;
  userNotificationMetadataService: UserNotificationMetadataService;
}

export class NotificationFramework implements INotificationFramework {
  public notificationService: NotificationService;
  public userNotificationMetadataService: UserNotificationMetadataService;

  /**
   * Constructs a new instance of NotificationFramework.
   * @param viewerId - The ID of the viewer.
   * @param logger - The logger instance.
   * @param dbConfig - The database configuration.
   */
  constructor(
    private readonly viewerId: string,
    private readonly logger: ILogger = new Logger(),
    dbConfig: IDatabaseConfig
  ) {
    try {
      verifyDatabaseConfig(dbConfig);
      const repository = RepositoryFactory.getRepositoryX(
        this.viewerId,
        dbConfig
      );
      this.notificationService = new NotificationService(
        this.viewerId,
        repository.notificationRepository,
        repository.userNotificationMetadataRepository,
        this.logger
      );

      this.userNotificationMetadataService =
        new UserNotificationMetadataService(
          this.viewerId,
          repository.userNotificationMetadataRepository,
          this.logger
        );
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
    return new NotificationFramework(viewerId, logger, {
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
    return new NotificationFramework(viewerId, logger, {
      type: DatabaseType.MongoDB,
      config: mongoConfig,
    });
  };

  /**
   * Gets the NotificationService instance.
   * @returns A NotificationService instance.
   */
  getNotificationService = (): NotificationService => {
    return this.notificationService;
  };

  /**
   * Gets the UserNotificationMetadataService instance.
   * @returns A UserNotificationMetadataService instance.
   */
  getUserNotificationMetadataService = (): UserNotificationMetadataService => {
    return this.userNotificationMetadataService;
  };
}

export default NotificationFramework;
export { Errors, DatabaseType };
