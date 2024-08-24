import { v4 } from "uuid";
import { INotification } from "../models/abstractNotification";

interface IMockNotification extends INotification {
  customField: string;
}

interface IMockNotificationResponse {
  notification: IMockNotification;
  customResponseField: string;
}

export class MockNotification implements IMockNotification {
  private static __type = "MockNotification";
  private constructor(
    public readonly uid: string,
    public readonly type: string = MockNotification.__type,
    public readonly ownerUid: string,
    public readonly senderUid: string,
    public readonly isRead: boolean,
    public readonly payload: Record<string, any>,
    public readonly createdAt: number,
    public readonly customField: string
  ) {}

  static new(
    ownerUid: string,
    senderUid: string,
    customField: string = "foo"
  ): MockNotification {
    return new MockNotification(
      v4(),
      MockNotification.__type,
      ownerUid,
      senderUid,
      false,
      {},
      Date.now(),
      customField
    );
  }

  static fromJson(raw: Record<string, any>): MockNotification {
    return new MockNotification(
      raw.uid,
      raw.type,
      raw.ownerUid,
      raw.senderUid,
      raw.isRead,
      raw.payload,
      raw.createdAt,
      raw.customField
    );
  }

  genResponse = async (): Promise<IMockNotificationResponse> => {
    return {
      notification: this,
      customResponseField: "custom-response",
    };
  };
}
