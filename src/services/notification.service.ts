import { Logger } from "../logger";
import { AbstractNotification } from "../models/abstractNotification";
import { NotificationPerm } from "../notificaionPerm";
import { INotificationRepository } from "../repositories/INotificationRepository";
import { UserNotificationMetadataService } from "./userNotificationMetadata.service";

import { RepositoryFactory } from "../repositories/repositoryFactory";
import { DatabaseType } from "../configs/database.config";

const notificationFactoryMap: {
  [key: string]: (raw: Object) => AbstractNotification;
} = {
  // NotificationTypes -> NotificationClass.
  // This is a map of all the notification types to their respective classes.
  // This is used to instantiate the correct class when fetching notifications from the database.
  // For example, if the type of the notification is "A", the factory method will return an instance of ANotification.
};

export type EnabledNotificationType = ReturnType<
  (typeof notificationFactoryMap)[keyof typeof notificationFactoryMap]
>;

export type EnabledNotificationResponseType = Awaited<
  ReturnType<EnabledNotificationType["genResponse"]>
>;

export class NotificationService {
  private notificationRepository: INotificationRepository;
  private userNotificationMetadataService: UserNotificationMetadataService;

  constructor(private readonly viewerUserId: string) {
    const repository = RepositoryFactory.getRepositoryX(
      viewerUserId,
      DatabaseType.MongoDB
    );
    this.notificationRepository = repository.notificationRepository;

    this.userNotificationMetadataService = new UserNotificationMetadataService(
      viewerUserId
    );
  }

  factory = (rawNotification: Object): EnabledNotificationType | null => {
    const notificationType = rawNotification["type"] as string;
    const factoryMethod = notificationFactoryMap[notificationType];
    if (!factoryMethod) {
      Logger.error(
        `No factory method found for notification type ${notificationType}`
      );
      return null;
    } else {
      return factoryMethod(rawNotification);
    }
  };

  static genFetchX = async (uuid: string): Promise<AbstractNotification> => {
    // Fetch a notification by its uuid.
    throw new Error("Not implemented");
  };

  private genFetchAllForUserX = async (): Promise<
    EnabledNotificationType[]
  > => {
    const rawNotifications =
      await this.notificationRepository.genFetchAllRawForViewerX();
    return (
      await Promise.all(
        rawNotifications.map((rawNotification: Object) =>
          this.factory(rawNotification)
        )
      )
    ).filter((notif) => notif != null) as EnabledNotificationType[];
  };

  genFetchAllResponseForUserX = async (): Promise<
    EnabledNotificationType[]
  > => {
    const notifications = await this.genFetchAllForUserX();
    return (
      await Promise.all(
        notifications.map((notification: AbstractNotification) =>
          notification ? notification.genResponse() : null
        )
      )
    ).filter((notif) => notif != null) as EnabledNotificationType[];
  };

  genMarkAllAsReadX = async (): Promise<void> => {
    try {
      await this.notificationRepository.genMarkAllAsReadX();
    } catch (error) {
      Logger.error(`Error marking all notifications as read: ${error.message}`);
      throw new Error(
        "Error marking all notifications as read. Please try again later."
      );
    }
  };

  genMarkAsReadX = async (uuid: string): Promise<void> => {
    const notifPerm = await NotificationPerm.fromNotificationUuid(
      this.viewerUserId,
      uuid
    );
    if (!notifPerm.viewerIsOwner) {
      throw new Error(
        "User doesn't have permission to mark this notification as read"
      );
    }
    await this.notificationRepository.genMarkAsReadX(uuid);
  };

  genSave = async (notification: AbstractNotification): Promise<boolean> => {
    try {
      await this.notificationRepository.genCreateX(notification);
    } catch (error) {
      Logger.error(`Error saving notification: ${error.message}`);
      return false;
    }
    try {
      await this.userNotificationMetadataService.genUpdateWatermarkForUserX();
    } catch (error) {
      Logger.error(`Error updating watermark for user: ${error.message}`);
    } finally {
      return true;
    }
  };

  genFetchNotificationX = async (
    notificationUid: string
  ): Promise<AbstractNotification | null> => {
    const perm = await NotificationPerm.fromNotificationUuid(
      this.viewerUserId,
      notificationUid
    );
    if (!perm.canView) {
      throw new Error(
        "User ${this.viewerUserId} doesn't have permission to view this notification: ${notificationUid}"
      );
    }

    try {
      const maybeNotification = await this.notificationRepository.genFetchX(
        notificationUid
      );
      return maybeNotification ? this.factory(maybeNotification) : null;
    } catch (error) {
      Logger.error(
        `Error fetching notification for user ${this.viewerUserId}: ${error.message}`
      );
      return null;
    }
  };
}
