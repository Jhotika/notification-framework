import {
  AbstractNotification,
  INotification,
} from "../../../models/abstractNotification";

interface IMockNotification {
  notification: INotification;
  customField: string;
}

export class MockNotification extends AbstractNotification {
  constructor(
    uid: string,
    type: string,
    payload: Record<string, any>,
    ownerUid: string,
    senderUid: string,
    isRead: boolean,
    createdAt: number,
    public readonly customField: string
  ) {
    super(uid, type, ownerUid, senderUid, isRead, payload, createdAt);
  }

  genResponse = async (): Promise<IMockNotification> => {
    return {
      notification: {
        uid: this.uid,
        type: this.type,
        payload: this.payload,
        ownerUid: this.ownerUid,
        isRead: this.isRead,
        createdAt: this.createdAt,
      } as INotification,
      customField: this.customField,
    };
  };
}
