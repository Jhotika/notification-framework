export interface INotification<T = string> {
  uid: string;
  type: T;
  ownerUid: string;
  senderUid: string;
  isRead: boolean;
  createdAt: number;
  payload: Record<string, any>;
}

export interface INotificationResponse {
  notification: INotification & Record<string, any>;
}

export abstract class AbstractNotification<T = string>
  implements INotification<T>
{
  constructor(
    public uid: string,
    public type: T,
    public ownerUid: string,
    public senderUid: string,
    public isRead: boolean,
    public payload: Record<string, any>,
    public createdAt: number // Unix timestamp in milliseconds
  ) {}

  abstract genResponse(): Promise<INotificationResponse | null>;
}
