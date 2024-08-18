export const NotificationTypes = {
  // e.g., A: "A",
};

export type NotificationType =
  (typeof NotificationTypes)[keyof typeof NotificationTypes];

export abstract class AbstractNotification {
  public type: NotificationType;
  constructor(
    public uuid: string,
    type: NotificationType,
    public payload: Record<string, any>,
    public ownerUuid: string,
    public isRead: boolean,
    public createdAt: number // Unix timestamp in milliseconds
  ) {
    this.type = type;
  }

  abstract genResponse(): Promise<any>;
}
