export interface INotification<T = string> {
  uuid: string;
  type: T;
  payload: Record<string, any>;
  ownerUuid: string;
  senderUuid: string;
  isRead: boolean;
  createdAt: number;
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
    public payload: Record<string, any>,
    public ownerUuid: string,
    public senderUuid: string,
    public isRead: boolean,
    public createdAt: number // Unix timestamp in milliseconds
  ) {}

  abstract genResponse(): Promise<INotificationResponse | null>;
}
