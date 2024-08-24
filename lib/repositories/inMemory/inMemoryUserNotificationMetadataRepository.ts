import {
  IUserNotificationMetadata,
  IUserNotificationMetadataRepository,
} from "../IUserNotificationMetadataRepository";
import { notificationsMap } from "./inMemoryNotificationRepository";

let userNotificationMetadataMap = new Map<string, Object>();

export class InMemoryUserNotificationMetadataRepository
  implements IUserNotificationMetadataRepository
{
  constructor() {}

  genFetchLatestCreationTimeForUserX = async (
    userId: string
  ): Promise<number> => {
    const notifications = Array.from(notificationsMap.values()).filter(
      (notification) => notification.ownerUid === userId
    );
    const sortedNotifications = notifications.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    return sortedNotifications.length > 0
      ? sortedNotifications[0].createdAt
      : 0;
  };

  genUpdateWatermarkForUserX = async (userId: string): Promise<void> => {
    userNotificationMetadataMap.set(userId, {
      userId,
      lastFetchTime: Date.now(),
    });
  };

  genFetchUserMetadataX = async (
    userId: string
  ): Promise<IUserNotificationMetadata> => {
    const userMetadata = userNotificationMetadataMap.get(userId);
    if (!userMetadata) {
      throw new Error("User metadata not found");
    }
    return userMetadata as IUserNotificationMetadata;
  };

  genFetchNumUnreadNotificationsX = async (userId: string): Promise<number> => {
    return Array.from(notificationsMap.values()).filter(
      (notification) => notification.ownerUid === userId && !notification.isRead
    ).length;
  };
}
