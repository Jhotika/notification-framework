export const NotificationTypes = {
  // e.g., A: "A",
};

export type NotificationType =
  (typeof NotificationTypes)[keyof typeof NotificationTypes];

export abstract class AbstractNotification {
  constructor(
    public uuid: string,
    public type: NotificationType,
    public payload: Object,
    public ownerUuid: string,
    public isRead: boolean,
    public createdAt: number
  ) {}

  abstract genResponse(): Promise<any>;
}
