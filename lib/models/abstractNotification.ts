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
  public readonly uid: string;
  public readonly type: T;
  public readonly ownerUid: string;
  public readonly senderUid: string;
  public readonly isRead: boolean;
  public readonly createdAt: number;
  public readonly payload: Record<string, any>;

  constructor(data: INotification<T>) {
    Object.assign(this, data);
  }

  public abstract genResponse(): Promise<INotificationResponse | null>;
  public abstract toINotification(): INotification<T>;
}

export interface INotificationResponse {
  notification: INotification & Record<string, any>;
}

export type ConcreteClass<T extends AbstractNotification<string>> = new (
  ...args: any[]
) => T;
