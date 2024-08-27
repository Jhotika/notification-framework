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
  private static readonly __type = "MockNotification";

  public readonly customField: string;

  constructor(data: IMockNotification) {
    super(data);
  }

  static new(
    ownerUid: string,
    senderUid: string,
    customField: string = "foo"
  ): MockNotification {
    return new MockNotification({
      uid: v4(),
      type: MockNotification.__type,
      ownerUid,
      senderUid,
      isRead: false,
      createdAt: Date.now(),
      payload: {},
      customField,
    });
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
