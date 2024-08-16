export interface INotificationRepository {
  // genCreateX is a method that creates a notification
  genCreateX(notification: Object): Promise<void>;
  // genFetchX is a method that fetches a notification for a user as a raw object
  genFetchX(userId: string, notificationUid: string): Promise<Object>;
  // genFetchAllRawForUserX is a method that fetches all notifications for a user as raw objects
  genFetchAllRawForUserX(userId: string): Promise<Array<Object>>;

  // genMarkAllAsReadX is a method that marks all notifications as read for a user
  genMarkAllAsReadX(userId: string): Promise<void>;
  // genMarkAsReadX is a method that marks a notification specified by the uid as read
  genMarkAsReadX(uid: string): Promise<void>;
}
