import { INotification } from "../../../models/abstractNotification";

interface IMockNotification extends INotification {
  customField: string;
}

interface IMockNotificationResponse {
  notification: IMockNotification;
  customResponseField: string;
}

export class MockNotification implements IMockNotification {
  constructor(
    public readonly uid: string,
    public readonly type: string,
    public readonly ownerUid: string,
    public readonly senderUid: string,
    public readonly isRead: boolean,
    public readonly payload: Record<string, any>,
    public readonly createdAt: number,
    public readonly customField: string
  ) {}

  genResponse = async (): Promise<IMockNotificationResponse> => {
    return {
      notification: this,
      customResponseField: "custom-response",
    };
  };
}
