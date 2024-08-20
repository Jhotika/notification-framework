import {
  IUserNotificationMetadata,
  IUserNotificationMetadataRepository,
} from "../IUserNotificationMetadataRepository";
import { notificationsMap } from "./inMemoryNotificationRepository";

let userNotificationMetadataMap = new Map<string, Object>();

export class InMemoryUserNotificationMetadataRepository
  implements IUserNotificationMetadataRepository
{
  constructor(public readonly viewerId: string) {}

  genFetchLatestCreationTimeForUserX = async (): Promise<number> => {
    const notifications = Array.from(notificationsMap.values()).filter(
      (notification) => notification.ownerUuid === this.viewerId
    );
    const sortedNotifications = notifications.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    return sortedNotifications.length > 0
      ? sortedNotifications[0].createdAt
      : 0;
  };

  genUpdateWatermarkForUserX = async (): Promise<void> => {
    const lastFetchTime = Date.now();
    userNotificationMetadataMap.set(this.viewerId, {
      userId: this.viewerId,
      lastFetchTime,
    });
  };

  genFetchUserMetadataX = async (): Promise<IUserNotificationMetadata> => {
    const userMetadata = userNotificationMetadataMap.get(this.viewerId);
    if (!userMetadata) {
      throw new Error("User metadata not found");
    }
    return userMetadata as IUserNotificationMetadata;
  };

  genFetchNumUnreadNotificationsX = async (): Promise<number> => {
    return Array.from(notificationsMap.values()).filter(
      (notification) =>
        notification.ownerUuid === this.viewerId && !notification.isRead
    ).length;
  };
}
