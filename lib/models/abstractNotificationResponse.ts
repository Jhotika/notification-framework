import {
  AbstractNotification,
  INotification,
  INotificationResponse,
} from "./abstractNotification";

export abstract class AbstractNotificationResponse {
  constructor(public notification: INotification) {}
  abstract genResponse(): Promise<INotificationResponse | null>;
}
