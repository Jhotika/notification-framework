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
    public createdAtInMs: number
  ) {
    this.type = type;
  }

  abstract genResponse(): Promise<any>;
}
