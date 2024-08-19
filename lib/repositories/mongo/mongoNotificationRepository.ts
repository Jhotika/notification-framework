import { AbstractNotification } from "../../models/abstractNotification";
import { INotificationRepository } from "../INotificationRepository";
import { IPrivacyUnsafe } from "../IUserNotificationMetadataRepository";
import { MongoNotificationCollection } from "./mongoCollections";

export class MongoNotificationRepository
  implements INotificationRepository, IPrivacyUnsafe
{
  constructor(
    private readonly viewerId: string,
    private readonly collection = MongoNotificationCollection
  ) {}

  genCreateX = async (notification: AbstractNotification): Promise<void> => {
    await this.collection.insertOne(notification);
  };

  genFetchX = async (notificationUid: string): Promise<Object | null> => {
    return await this.collection.findOne({
      ownerUuid: this.viewerId,
      uuid: notificationUid,
    });
  };

  genMarkAllAsReadX = async (): Promise<void> => {
    await this.collection.updateMany(
      { ownerUuid: this.viewerId },
      { $set: { isRead: true } }
    );
  };

  genMarkAsReadX = async (uid: string): Promise<void> => {
    await this.collection.updateOne({ uuid: uid }, { $set: { isRead: true } });
  };

  genFetchAllRawForViewerX = async (): Promise<Array<Object>> => {
    return await this.collection
      .find({
        ownerUuid: this.viewerId,
      })
      .toArray();
  };
}
