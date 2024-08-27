import {
  DatabaseType,
  IDatabaseConfig,
  verifyDatabaseConfig,
} from "./configs/db/database.config";
import { Errors } from "./errors";
import { Logger, type ILogger } from "./logger";
import {
  AbstractNotification,
  ConcreteClass,
} from "./models/abstractNotification";
import type { INotificationRepository } from "./repositories/INotificationRepository";
import type { IUserNotificationMetadataRepository } from "./repositories/IUserNotificationMetadataRepository";
import { RepositoryFactory } from "./repositories/repositoryFactory";
import { NotificationService } from "./services/notification.service";
import { NotificationServiceBuilder } from "./services/notification.service.builder";
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
   * @param dbConfig - The database configuration.
   * @param logger - The logger instance.
   */

  private static instance: NotificationFramework | null = null;
  public notificationRepository: INotificationRepository;
  public userNotificationMetadataRepository: IUserNotificationMetadataRepository;

  private constructor(
    private readonly dbConfig: IDatabaseConfig,
    private readonly logger: ILogger = new Logger(),
    private readonly notificationClasess: Readonly<
      Array<ConcreteClass<AbstractNotification<string>>>
    >
  ) {
    try {
      verifyDatabaseConfig(dbConfig);
    } catch (error) {
      this.logger.error("Error initializing NotificationFramework:", error);
      throw error; // Re-throw
    }
  }

  static getInstanceX = (
    dbConfig: IDatabaseConfig,
    notificationClasses: Readonly<
      Array<ConcreteClass<AbstractNotification<string>>>
    >,
    logger: ILogger
  ): NotificationFramework => {
    if (!this.instance) {
      this.instance = new NotificationFramework(
        dbConfig,
        logger,
        notificationClasses
      );
      const { notificationRepository, userNotificationMetadataRepository } =
        RepositoryFactory.getRepositoryX(dbConfig);
      this.instance.notificationRepository = notificationRepository;
      this.instance.userNotificationMetadataRepository =
        userNotificationMetadataRepository;
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

  /**
   * Gets the NotificationService instance.
   * @returns A NotificationService instance.
   */
  getNotificationServiceX = (viewerId: string): NotificationService => {
    try {
      return new NotificationService(
        viewerId,
        this.notificationRepository,
        this.userNotificationMetadataRepository,
        this.notificationClasess,
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
      return new UserNotificationMetadataService(
        viewerId,
        this.userNotificationMetadataRepository,
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
export {
  DatabaseType,
  Errors,
  NotificationService,
  NotificationServiceBuilder,
  UserNotificationMetadataService,
};
