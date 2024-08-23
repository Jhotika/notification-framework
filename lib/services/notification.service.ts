import type { ILogger } from "../logger";
import {
  INotification,
  INotificationResponse,
} from "../models/abstractNotification";
import { NotificationPerm } from "../notificaionPerm";
import { INotificationRepository } from "../repositories/INotificationRepository";
import { UserNotificationMetadataService } from "./userNotificationMetadata.service";

import { IUserNotificationMetadataRepository } from "../repositories/IUserNotificationMetadataRepository";
import { UserPermissionError } from "../errors/userPermissionError";

const notificationFactoryMap: {
  [key: string]: (raw: Object) => INotification;
} = {
  // NotificationTypes -> NotificationClass.
  // This is a map of all the notification types to their respective classes.
  // This is used to instantiate the correct class when fetching notifications from the database.
  // For example, if the type of the notification is "A", the factory method will return an instance of ANotification.
};

export class NotificationService {
  private userNotificationMetadataService: UserNotificationMetadataService;

  constructor(
    public readonly viewerId: string,
    public readonly notificationRepository: INotificationRepository,
    public readonly userNotificationMetadataRepository: IUserNotificationMetadataRepository,
    public readonly logger: ILogger
  ) {
    this.userNotificationMetadataService = new UserNotificationMetadataService(
      viewerId,
      this.userNotificationMetadataRepository,
      this.logger
    );
  }

  factory = (rawNotification: Object): INotification | null => {
    const notificationType = rawNotification["type"] as string;
    const factoryMethod = notificationFactoryMap[notificationType];
    if (!factoryMethod) {
      this.logger.error(
        `No factory method found for notification type ${notificationType}`
      );
      return null;
    } else {
      return factoryMethod(rawNotification);
    }
  };

  genFetchX = async (uuid: string): Promise<INotification | null> => {
    return (await this.genFetchNotificationX(uuid)) as INotification | null;
  };

  private genFetchAllForUserX = async (): Promise<INotification[]> => {
    const rawNotifications =
      await this.notificationRepository.genFetchAllRawForViewerX(this.viewerId);
    return (
      await Promise.all(
        rawNotifications.map((rawNotification: Object) =>
          this.factory(rawNotification)
        )
      )
    ).filter((notif) => notif != null) as INotification[];
  };

  genFetchAllResponseForUserX = async (): Promise<INotificationResponse[]> => {
    const notifications = await this.genFetchAllForUserX();
    return (
      await Promise.all(
        notifications.map((notification: INotification) =>
          notification ? notification.genResponse() : null
        )
      )
    ).filter((notif) => notif != null) as INotificationResponse[];
  };

  genMarkAllAsReadX = async (): Promise<void> => {
    try {
      await this.notificationRepository.genMarkAllAsReadX(this.viewerId);
    } catch (error) {
      this.logger.error(
        `Error marking all notifications as read: ${error.message}`
      );
      throw new Error(
        "Error marking all notifications as read. Please try again later."
      );
    }
  };

  genMarkAsReadX = async (uuid: string): Promise<void> => {
    let notif: INotification | null;
    try {
      notif = await this.genFetchNotificationX(uuid);
      if (!notif) {
        throw new Error(`Notification not found: ${uuid}`);
      }
    } catch (error) {
      this.logger.error(
        `Error fetching notification for user ${this.viewerId}: ${error.message}`
      );
      throw new Error(
        `Error fetching notification for user ${this.viewerId}: ${error.message}`
      );
    }

    const notifPerm = await NotificationPerm.fromNotification(
      this.viewerId,
      notif
    );
    if (!notifPerm.viewerIsOwner) {
      throw new UserPermissionError(
        "User doesn't have permission to mark this notification as read"
      );
    }
    await this.notificationRepository.genMarkAsReadX(uuid);
  };

  genSave = async (notification: INotification): Promise<boolean> => {
    try {
      await this.notificationRepository.genCreateX(notification);
    } catch (error) {
      this.logger.error(`Error saving notification: ${error.message}`);
      return false;
    }
    try {
      await this.userNotificationMetadataService.genUpdateWatermarkForUserX();
    } catch (error) {
      this.logger.error(`Error updating watermark for user: ${error.message}`);
    } finally {
      return true;
    }
  };

  genFetchNotificationX = async (
    notificationUid: string
  ): Promise<INotification | null> => {
    try {
      const maybeNotification = await this.notificationRepository.genFetchX(
        this.viewerId,
        notificationUid
      );
      if (!maybeNotification) {
        return null;
      }
      const perm = await NotificationPerm.fromNotification(
        this.viewerId,
        maybeNotification as INotification
      );
      if (!perm.canView) {
        throw new UserPermissionError(
          "User ${this.viewerId} doesn't have permission to view this notification: ${notificationUid}"
        );
      }
      return maybeNotification ? this.factory(maybeNotification) : null;
    } catch (error) {
      this.logger.error(
        `Error fetching notification for user ${this.viewerId}: ${error.message}`
      );
      return null;
    }
  };

  genDeleteNotification = async (notificationUid: string): Promise<boolean> => {
    try {
      await this.notificationRepository.genDeleteX(notificationUid);
      return true;
    } catch (error) {
      this.logger.error(
        `Error deleting notification for user ${this.viewerId}: ${error.message}`
      );
      return false;
    }
  };
}
