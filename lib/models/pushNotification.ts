// Push notification will be used as a strategy for the notification framework
// classes extending this class will implement the push notification strategy
// and the notification framework will use the strategy to send the notification


export interface IPushNotification {
  title: string;
  body: string;
  data: Record<string, any>;

  genBuildMessage(): Promise<IPushNotificationResponse | null>;
  genSendMessageX(): Promise<void>;
}

export interface IPushNotificationResponse {
  notification: IPushNotification;
}
