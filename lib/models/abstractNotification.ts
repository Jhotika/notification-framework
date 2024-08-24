export interface INotification<T = string> {
  uid: string;
  type: T;
  ownerUid: string;
  senderUid: string;
  isRead: boolean;
  createdAt: number;
  payload: Record<string, any>;
}

export abstract class AbstractNotification<T = string>
  implements INotification<T>
{
  public abstract uid: string;
  public abstract type: T;
  public abstract ownerUid: string;
  public abstract senderUid: string;
  public abstract isRead: boolean;
  public abstract createdAt: number;
  public abstract payload: Record<string, any>;

  public abstract genResponse(): Promise<INotificationResponse | null>;
  public abstract toINotification(): INotification<T>;
}

export interface INotificationResponse {
  notification: INotification & Record<string, any>;
}
