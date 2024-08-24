export interface INotificationRepository {
  // genCreateX is a method that creates a notification
  genCreateX(notification: Object): Promise<void>;
  // genFetchX is a method that fetches a notification for a user as a raw object
  genFetchX(notificationUid: string): Promise<Object | null>;
  // genFetchAllRawForViewerX is a method that fetches all notifications for a user as raw objects
  genFetchAllRawForViewerX(userId: string): Promise<Array<Object>>;

  // genMarkAllAsReadX is a method that marks all notifications as read for a user
  genMarkAllAsReadX(ownerId: string): Promise<void>;
  // genMarkAsReadX is a method that marks a notification specified by the uid as read
  genMarkAsReadX(uid: string): Promise<void>;

  // genDeleteX is a method that deletes a notification specified by the uid
  genDeleteX(uid: string): Promise<void>;
}
