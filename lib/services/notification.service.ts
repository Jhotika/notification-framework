import { Logger, type ILogger } from "../logger";
import {
  AbstractNotification,
  type ConcreteClass,
  type INotification,
  type INotificationResponse,
} from "../models/abstractNotification";
import { NotificationPerm } from "../notificaionPerm";
import type { INotificationRepository } from "../repositories/INotificationRepository";
import { UserNotificationMetadataService } from "./userNotificationMetadata.service";

import { UserPermissionError } from "../errors/userPermissionError";
import { notificationFactoryX } from "../models/notificationFactory";
import type { IUserNotificationMetadataRepository } from "../repositories/IUserNotificationMetadataRepository";

export class NotificationService {
  private userNotificationMetadataService: UserNotificationMetadataService;

  constructor(
    public readonly viewerId: string,
    public readonly notificationRepository: INotificationRepository,
    public readonly userNotificationMetadataRepository: IUserNotificationMetadataRepository,
    public readonly notificationClasses: Readonly<
      Array<ConcreteClass<AbstractNotification<string>>>
    >,
    public readonly logger: ILogger = new Logger()
  ) {
    this.userNotificationMetadataService = new UserNotificationMetadataService(
      viewerId,
      this.userNotificationMetadataRepository,
      this.logger
    );
  }

  private genFetchAllForUserX = async (
    lastFetchTimeInMs: number | null
  ): Promise<AbstractNotification[]> => {
    const rawNotifications =
      await this.notificationRepository.genFetchAllRawForViewerX(
        this.viewerId,
        lastFetchTimeInMs
      );
    // intentinally running async
    await this.userNotificationMetadataService.genUpdateWatermarkForUserX();
    return (
      await Promise.all(
        rawNotifications
          .map((rawNotification: Object) => {
            try {
              return notificationFactoryX(
                rawNotification as AbstractNotification,
                this.notificationClasses
              );
            } catch (error) {
              this.logger.error(
                `Error creating notification instance: ${error.message}`
              );
              return null;
            }
          })
          .filter((notif) => notif != null)
      )
    ).filter((notif) => notif != null) as AbstractNotification[];
  };

  genFetchAllResponseForUserX = async (
    lastFetchTimeInMs: number | null
  ): Promise<INotificationResponse[]> => {
    const notifications = await this.genFetchAllForUserX(lastFetchTimeInMs);
    return (
      await Promise.all(
        notifications.map((notification: AbstractNotification) =>
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

    const notifPerm = NotificationPerm.fromNotification(this.viewerId, notif);
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
      return true;
    } catch (error) {
      this.logger.error(`Error saving notification: ${error.message}`);
      return false;
    }
  };

  private genFetchNotificationX = async (
    notificationUid: string
  ): Promise<AbstractNotification | null> => {
    try {
      const maybeNotification__PRIVACY_UNSAFE =
        await this.notificationRepository.genFetchX(notificationUid);
      if (!maybeNotification__PRIVACY_UNSAFE) {
        return null;
      }
      const perm = NotificationPerm.fromNotification(
        this.viewerId,
        maybeNotification__PRIVACY_UNSAFE as AbstractNotification
      );
      if (!perm.canView) {
        throw new UserPermissionError(
          "User ${this.viewerId} doesn't have permission to view this notification: ${notificationUid}"
        );
      }
      const maybeNotification =
        maybeNotification__PRIVACY_UNSAFE as INotification;
      try {
        return notificationFactoryX(
          maybeNotification,
          this.notificationClasses
        );
      } catch (error) {
        this.logger.error(
          `Error creating notification instance: ${error.message}`
        );
        return null;
      }
    } catch (error) {
      this.logger.error(
        `Error fetching notification for user ${this.viewerId}: ${error.message}`
      );
      return null;
    }
  };

  genFetchNotificationResponseX = async (
    notificationUid: string
  ): Promise<INotificationResponse | null> => {
    const notification = await this.genFetchNotificationX(notificationUid);
    if (!notification) {
      return null;
    }
    return await notification.genResponse();
  };

  genDeleteNotificationX = async (
    notificationUid: string
  ): Promise<boolean> => {
    const existingNotif = await this.genFetchNotificationX(notificationUid);
    if (!existingNotif) {
      return false;
    }
    const notifPerm = NotificationPerm.fromNotification(
      this.viewerId,
      existingNotif as INotification
    );
    // Only the owner of the notification can delete it
    // TODO: Add support for super admins
    if (!notifPerm.viewerIsOwner) {
      throw new UserPermissionError(
        "User doesn't have permission to delete this notification"
      );
    }
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

  genDeleteNotificationBypassingPermCheck = async (notificationUid: string) => {
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
