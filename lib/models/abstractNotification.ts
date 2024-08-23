export interface INotification<T = string> {
  uid: string;
  type: T;
  ownerUid: string;
  senderUid: string;
  isRead: boolean;
  createdAt: number;
  payload: Record<string, any>;

  genResponse(): Promise<INotificationResponse | null>;
}

export interface INotificationResponse {
  notification: INotification & Record<string, any>;
}
