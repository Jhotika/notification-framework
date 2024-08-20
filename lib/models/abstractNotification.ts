export interface INotification {
  uuid: string;
  type: string;
  payload: Record<string, any>;
  ownerUuid: string;
  isRead: boolean;
  createdAt: number;
}

export interface INotificationResponse {
  notification: INotification & Record<string, any>;
}

export abstract class AbstractNotification<T = string> {
  public type: T;
  constructor(
    public uuid: string,
    type: T,
    public payload: Record<string, any>,
    public ownerUuid: string,
    public isRead: boolean,
    public createdAt: number // Unix timestamp in milliseconds
  ) {
    this.type = type;
  }

  abstract genResponse(): Promise<INotificationResponse | null>;
}
