import {
  AbstractNotification,
  INotificationResponse,
} from "./abstractNotification";

export abstract class AbstractNotificationResponse {
  constructor(public notification: AbstractNotification) {}
  abstract genResponse(): Promise<INotificationResponse | null>;
}
