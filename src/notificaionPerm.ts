import { Request, Response, NextFunction } from "express";
import { AbstractNotification } from "./abstractNotification";
import { NotificationService } from "../../../services/notifications/notificationService";

export class NotificationPermController {
  static requireOwnership = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { viewerUuid } = res.locals;
    const notification = await NotificationService.fetch(req.params.uuid);
    const perm = new NotificationPerm(viewerUuid, notification);
    if (!perm.canView) {
      return res.status(403).json({
        error: "User doesn't have permission to see this notification",
      });
    }
    res.locals.notification = notification;
    next();
  };
}

export class NotificationPerm {
  constructor(
    public viewerUid: string,
    public notification: AbstractNotification
  ) {}

  static fromNotificationUuid = async (
    viewerUid: string,
    notificationUid: string
  ) => {
    const notification = await NotificationService.fetch(notificationUid);
    return new NotificationPerm(viewerUid, notification);
  };

  get viewerIsOwner() {
    return this.notification.ownerUid === this.viewerUid;
  }

  get canView() {
    return this.viewerIsOwner;
  }
}
