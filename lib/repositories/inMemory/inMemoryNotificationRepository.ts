import { INotification } from "../../models/abstractNotification";
import { INotificationRepository } from "../INotificationRepository";
import { IPrivacyUnsafe } from "../IUserNotificationMetadataRepository";

export let notificationsMap = new Map<string, INotification>();

export class InMemoryNotificationRepository
  implements INotificationRepository, IPrivacyUnsafe
{
  constructor() {}

  genCreateX = async (notification: INotification): Promise<void> => {
    if (notificationsMap.has(notification.uid)) {
      throw new Error("Notification already exists");
    }
    notificationsMap.set(notification.uid, notification);
  };

  genFetchX = async (
    notificationUid: string
  ): Promise<INotification | null> => {
    return notificationsMap.get(notificationUid) || null;
  };

  genMarkAllAsReadX = async (): Promise<void> => {
    Array.from(notificationsMap.values())
      // .filter((notification) => notification.ownerUuid === this.viewerId)
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

  genFetchAllRawForViewerX = async (
    userUid: string,
    genFetchAllRawForViewerX: number | null
  ): Promise<Array<INotification>> => {
    return Array.from(notificationsMap.values()).filter(
      (notification) =>
        notification.ownerUid === userUid &&
        notification.createdAt > (genFetchAllRawForViewerX ?? 0)
    );
  };

  genDeleteX = async (uid: string): Promise<void> => {
    notificationsMap.delete(uid);
  };
}
