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
    uuid: string,
    type: string,
    payload: Record<string, any>,
    ownerUuid: string,
    senderUuid: string,
    isRead: boolean,
    createdAt: number,
    public readonly customField: string
  ) {
    super(uuid, type, payload, ownerUuid, senderUuid, isRead, createdAt);
  }

  genResponse = async (): Promise<IMockNotification> => {
    return {
      notification: {
        uuid: this.uuid,
        type: this.type,
        payload: this.payload,
        ownerUuid: this.ownerUuid,
        isRead: this.isRead,
        createdAt: this.createdAt,
      } as INotification,
      customField: this.customField,
    };
  };
}
