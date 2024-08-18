import { AbstractNotification } from "./models/abstractNotification";

export class NotificationPerm {
  constructor(
    public viewerUid: string,
    public notification: {
      ownerUuid: string;
    }
  ) {}

  static fromNotification = async (
    viewerUid: string,
    notification: AbstractNotification
  ) => {
    return new NotificationPerm(viewerUid, notification);
  };

  static fromRawNotification = async (
    viewerUid: string,
    rawNotification: Object
  ) => {
    return new NotificationPerm(viewerUid, rawNotification["ownerUuid"]);
  };

  get viewerIsOwner() {
    return this.notification.ownerUuid === this.viewerUid;
  }

  get canView() {
    return this.viewerIsOwner;
  }
}
