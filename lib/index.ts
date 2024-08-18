import {
  DatabaseConfig,
  verifyDatabaseConfig,
} from "../configs/database.config";
import { Errors } from "./errors";
import { Logger, type ILogger } from "./logger";
import { RepositoryFactory } from "./repositories/repositoryFactory";
import { NotificationService } from "./services/notification.service";
import { UserNotificationMetadataService } from "./services/userNotificationMetadata.service";

class NotificationFramework {
  private notificationService: NotificationService;
  private userNotificationMetadataService: UserNotificationMetadataService;

  /**
   * Constructs a new instance of NotificationFramework.
   * @param viewerId - The ID of the viewer.
   * @param logger - The logger instance.
   * @param dbConfig - The database configuration.
   */
  constructor(
    private readonly viewerId: string,
    private readonly logger: ILogger = new Logger(),
    private readonly dbConfig: DatabaseConfig
  ) {
    try {
      verifyDatabaseConfig(this.dbConfig);
      const repository = RepositoryFactory.getRepositoryX(
        this.viewerId,
        this.dbConfig.type
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
export { Errors };
