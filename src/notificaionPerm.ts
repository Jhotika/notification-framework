import { AbstractNotification } from "./models/abstractNotification";
import { NotificationService } from "./services/notification.service";

export class NotificationPerm {
  constructor(
    public viewerUid: string,
    public notification: AbstractNotification
  ) {}

  static fromNotificationUuid = async (
    viewerUid: string,
    notificationUid: string
  ) => {
    const notificationService = new NotificationService(viewerUid);
    const notification = await notificationService.genFetchNotificationX(
      notificationUid
    );
    if (!notification) {
      throw new Error("Notification not found");
    }
    return new NotificationPerm(viewerUid, notification);
  };

  get viewerIsOwner() {
    return this.notification.ownerUuid === this.viewerUid;
  }

  get canView() {
    return this.viewerIsOwner;
  }
}
