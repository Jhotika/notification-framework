import { AbstractNotification } from "../../models/abstractNotification";
import { INotificationRepository } from "../INotificationRepository";
import { MongoNotificationCollection } from "./mongoCollections";
import { IPrivacyUnsafe } from "../IUserNotificationMetadataRepository";

export class MongoNotificationRepository
  implements INotificationRepository, IPrivacyUnsafe
{
  static collection = MongoNotificationCollection;
  constructor(private readonly viewerId: string) {}

  genCreateX = async (notification: AbstractNotification): Promise<void> => {
    await MongoNotificationCollection.insertOne(notification);
  };

  genFetchX = async (notificationUid: string): Promise<Object | null> => {
    return await MongoNotificationCollection.findOne({
      ownerUuid: this.viewerId,
      uuid: notificationUid,
    });
  };

  genMarkAllAsReadX = async (): Promise<void> => {
    await MongoNotificationCollection.updateMany(
      { ownerUuid: this.viewerId },
      { $set: { isRead: true } }
    );
  };

  genMarkAsReadX = async (uid: string): Promise<void> => {
    await MongoNotificationCollection.updateOne(
      { uuid: uid },
      { $set: { isRead: true } }
    );
  };

  genFetchAllRawForViewerX = async (): Promise<Array<Object>> => {
    return await MongoNotificationCollection.find({
      ownerUuid: this.viewerId,
    }).toArray();
  };
}
