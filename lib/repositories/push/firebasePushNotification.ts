import type {
  IPushNotificationResponse,
  IPushNotification,
} from "../../models/pushNotification";

import admin from "firebase-admin";

export class FirebasePushNotification implements IPushNotification {
  constructor(
    public title: string,
    public body: string,
    public data: Record<string, any>,
    private registrationToken: string,
    private imageUrl?: string | null,
    private isDryRun: boolean = true
  ) {}

  public async genBuildMessage(): Promise<IPushNotificationResponse | null> {
    return {
      notification: this,
    };
  }

  public async genSendMessageX(): Promise<void> {
    await admin.messaging().send(
      {
        token: this.registrationToken,
        notification: {
          title: this.title,
          body: this.body,
          imageUrl: this.imageUrl ?? undefined,
        },
        data: this.data,
      },
      this.isDryRun
    );
  }
}
