import { AbstractNotification } from "./models/abstractNotification";
import { NotificationService } from "./services/notification.service";
import { INotificationRepository } from "./repositories/INotificationRepository";
import { IUserNotificationMetadataRepository } from "./repositories/IUserNotificationMetadataRepository";

export class NotificationPerm {
  constructor(
    public viewerUid: string,
    public notification: AbstractNotification
  ) {}

  static fromNotificationUuid = async (
    viewerUserId: string,
    notificationUid: string,
    notificationRepository: INotificationRepository,
    userNotificationMetadataRepository: IUserNotificationMetadataRepository
  ) => {
    const notificationService = new NotificationService(
      viewerUserId,
      notificationRepository,
      userNotificationMetadataRepository
    );
    const notification = await notificationService.genFetchNotificationX(
      notificationUid
    );
    if (!notification) {
      throw new Error("Notification not found");
    }
    return new NotificationPerm(viewerUserId, notification);
  };

  get viewerIsOwner() {
    return this.notification.ownerUuid === this.viewerUid;
  }

  get canView() {
    return this.viewerIsOwner;
  }
}
