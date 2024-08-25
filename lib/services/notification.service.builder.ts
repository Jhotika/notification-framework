import { Logger, type ILogger } from "../logger";
import {
  AbstractNotification,
  type ConcreteClass,
} from "../models/abstractNotification";
import { INotificationRepository } from "../repositories/INotificationRepository";
import type { IUserNotificationMetadataRepository } from "../repositories/IUserNotificationMetadataRepository";
import { NotificationService } from "./notification.service";

export class NotificationServiceBuilder {
  private viewerId: string;
  private notificationRepository: INotificationRepository;
  private userNotificationMetadataRepository: IUserNotificationMetadataRepository;
  private logger: ILogger;
  private notificationClasses: Array<
    ConcreteClass<AbstractNotification<string>>
  >;
  constructor() {}

  withViewerId(viewerId: string): NotificationServiceBuilder {
    this.viewerId = viewerId;
    return this;
  }

  withNotificationRepository(
    notificationRepository: INotificationRepository
  ): NotificationServiceBuilder {
    this.notificationRepository = notificationRepository;
    return this;
  }

  withUserNotificationMetadataRepository(
    userNotificationMetadataRepository: IUserNotificationMetadataRepository
  ): NotificationServiceBuilder {
    this.userNotificationMetadataRepository =
      userNotificationMetadataRepository;
    return this;
  }

  withLogger(logger: ILogger): NotificationServiceBuilder {
    this.logger = logger;
    return this;
  }

  withNotificationClasses(
    notificationClasses: Array<ConcreteClass<AbstractNotification<string>>>
  ): NotificationServiceBuilder {
    this.notificationClasses = notificationClasses;
    return this;
  }

  build() {
    return new NotificationService(
      this.viewerId,
      this.notificationRepository,
      this.userNotificationMetadataRepository,
      this.notificationClasses,
      this.logger ?? new Logger()
    );
  }
}
