import type { ILogger } from "../logger";
import { AbstractNotification } from "../models/abstractNotification";
import { NotificationPerm } from "../notificaionPerm";
import { INotificationRepository } from "../repositories/INotificationRepository";
import { UserNotificationMetadataService } from "./userNotificationMetadata.service";

import { IUserNotificationMetadataRepository } from "../repositories/IUserNotificationMetadataRepository";

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
  private userNotificationMetadataService: UserNotificationMetadataService;

  constructor(
    private readonly viewerUserId: string,
    private readonly notificationRepository: INotificationRepository,
    private readonly userNotificationMetadataRepository: IUserNotificationMetadataRepository,
    private readonly logger: ILogger
  ) {
    this.userNotificationMetadataService = new UserNotificationMetadataService(
      viewerUserId,
      this.userNotificationMetadataRepository,
      this.logger
    );
  }

  factory = (rawNotification: Object): EnabledNotificationType | null => {
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
      this.logger.error(
        `Error marking all notifications as read: ${error.message}`
      );
      throw new Error(
        "Error marking all notifications as read. Please try again later."
      );
    }
  };

  genMarkAsReadX = async (uuid: string): Promise<void> => {
    let notif: AbstractNotification | null;
    try {
      notif = await this.genFetchNotificationX(uuid);
      if (!notif) {
        throw new Error(`Notification not found: ${uuid}`);
      }
    } catch (error) {
      this.logger.error(
        `Error fetching notification for user ${this.viewerUserId}: ${error.message}`
      );
      throw new Error(
        `Error fetching notification for user ${this.viewerUserId}: ${error.message}`
      );
    }

    const notifPerm = await NotificationPerm.fromNotification(
      this.viewerUserId,
      notif
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
  ): Promise<AbstractNotification | null> => {
    try {
      const maybeNotification = await this.notificationRepository.genFetchX(
        notificationUid
      );
      if (!maybeNotification) {
        return null;
      }
      const perm = await NotificationPerm.fromNotification(
        this.viewerUserId,
        maybeNotification as AbstractNotification
      );
      if (!perm.canView) {
        throw new Error(
          "User ${this.viewerUserId} doesn't have permission to view this notification: ${notificationUid}"
        );
      }
      return maybeNotification ? this.factory(maybeNotification) : null;
    } catch (error) {
      this.logger.error(
        `Error fetching notification for user ${this.viewerUserId}: ${error.message}`
      );
      return null;
    }
  };
}
