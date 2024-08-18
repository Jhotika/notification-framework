import {
  DatabaseConfig,
  verifyDatabaseConfig,
} from "../configs/database.config";
import type { ILogger } from "./logger";
import { RepositoryFactory } from "./repositories/repositoryFactory";
import { NotificationService } from "./services/notification.service";
import { UserNotificationMetadataService } from "./services/userNotificationMetadata.service";

class NotificationFramework {
  private notifationService: NotificationService;
  private userNotificationMetadataService: UserNotificationMetadataService;

  constructor(
    private readonly viewerId: string,
    private readonly logger: ILogger,
    private readonly dbConfig: DatabaseConfig
  ) {
    verifyDatabaseConfig(this.dbConfig);
    const repository = RepositoryFactory.getRepositoryX(
      this.viewerId,
      this.dbConfig.type
    );
    this.notifationService = new NotificationService(
      this.viewerId,
      repository.notificationRepository,
      repository.userNotificationMetadataRepository,
      this.logger
    );

    this.userNotificationMetadataService = new UserNotificationMetadataService(
      this.viewerId,
      repository.userNotificationMetadataRepository,
      this.logger
    );
  }

  getNotificationService = (): NotificationService => {
    return this.notifationService;
  };

  getUserNotificationMetadataService = (): UserNotificationMetadataService => {
    return this.userNotificationMetadataService;
  };
}

export default NotificationFramework;
