import { v4 } from "uuid";
import {
  AbstractNotification,
  INotification,
} from "../models/abstractNotification";

interface IMockNotification extends INotification {
  customField: string;
}

interface IMockNotificationResponse {
  notification: IMockNotification;
  customResponseField: string;
}

export class MockNotification
  extends AbstractNotification
  implements IMockNotification
{
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
  ) {
    super();
  }

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

  static fromJson(json: Record<string, any>): MockNotification {
    return new MockNotification(
      json.uid,
      json.type,
      json.ownerUid,
      json.senderUid,
      json.isRead,
      json.payload,
      json.createdAt,
      json.customField
    );
  }

  toINotification(): IMockNotification {
    return {
      uid: this.uid,
      type: this.type,
      ownerUid: this.ownerUid,
      senderUid: this.senderUid,
      isRead: this.isRead,
      payload: this.payload,
      createdAt: this.createdAt,
      customField: this.customField,
    };
  }

  genResponse = async (): Promise<IMockNotificationResponse> => {
    return {
      notification: this.toINotification(),
      customResponseField: "custom-response",
    };
  };
}
