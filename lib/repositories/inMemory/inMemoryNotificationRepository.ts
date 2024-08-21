import {
  AbstractNotification,
  INotification,
} from "../../models/abstractNotification";
import { INotificationRepository } from "../INotificationRepository";
import { IPrivacyUnsafe } from "../IUserNotificationMetadataRepository";

export let notificationsMap = new Map<string, AbstractNotification>();

export class InMemoryNotificationRepository
  implements INotificationRepository, IPrivacyUnsafe
{
  constructor(private readonly viewerId: string) {}

  genCreateX = async (notification: AbstractNotification): Promise<void> => {
    if (notificationsMap.has(notification.uuid)) {
      throw new Error("Notification already exists");
    }
    notificationsMap.set(notification.uuid, notification);
  };

  genFetchX = async (
    notificationUid: string
  ): Promise<AbstractNotification | null> => {
    return notificationsMap.get(notificationUid) || null;
  };

  genMarkAllAsReadX = async (): Promise<void> => {
    Array.from(notificationsMap.values())
      .filter((notification) => notification.ownerUuid === this.viewerId)
      .forEach((notification) => {
        notification.isRead = true;
      });
  };

  genMarkAsReadX = async (uid: string): Promise<void> => {
    const notification = notificationsMap.get(uid);
    if (notification) {
      notification.isRead = true;
    }
  };

  genFetchAllRawForViewerX = async (): Promise<Array<INotification>> => {
    return Array.from(notificationsMap.values()).filter(
      (notification) => notification.ownerUuid === this.viewerId
    );
  };

  genDeleteX = async (uid: string): Promise<void> => {
    notificationsMap.delete(uid);
  };
}
