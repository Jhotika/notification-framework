export interface INotification<T = string> {
  uuid: string;
  type: T;
  ownerUuid: string;
  senderUuid: string;
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
    public uuid: string,
    public type: T,
    public ownerUuid: string,
    public senderUuid: string,
    public isRead: boolean,
    public payload: Record<string, any>,
    public createdAt: number // Unix timestamp in milliseconds
  ) {}

  abstract genResponse(): Promise<INotificationResponse | null>;
}
