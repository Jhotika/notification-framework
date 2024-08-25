import type { INotification } from "./models/abstractNotification";

export class NotificationPerm {
  constructor(
    public viewerUid: string,
    public notification: {
      ownerUid: string;
    }
  ) {}

  static fromNotification = (
    viewerUid: string,
    notification: INotification
  ) => {
    return new NotificationPerm(viewerUid, notification);
  };

  get viewerIsOwner() {
    return this.notification.ownerUid === this.viewerUid;
  }

  get canView() {
    return this.viewerIsOwner;
  }
}
