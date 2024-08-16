import { AbstractNotification } from "models/abstractNotification";
import { INotificationRepository } from "./INotificationRepository";
import { MongoNotificationCollection } from "./mongoCollections";
import { IPrivacyUnsafe } from "./IUserNotificationMetadataRepository";

export class MongoNotificationRepository
  implements INotificationRepository, IPrivacyUnsafe
{
  genCreateX = async (notification: AbstractNotification): Promise<void> => {
    await MongoNotificationCollection.insertOne(notification);
  };

  genFetchX = async (
    userId: string,
    notificationUid: string
  ): Promise<Object | null> => {
    return await MongoNotificationCollection.findOne({
      ownerUuid: userId,
      uuid: notificationUid,
    });
  };

  genMarkAllAsReadX = async (userId: string): Promise<void> => {
    await MongoNotificationCollection.updateMany(
      { ownerUuid: userId },
      { $set: { isRead: true } }
    );
  };

  genMarkAsReadX = async (uid: string): Promise<void> => {
    await MongoNotificationCollection.updateOne(
      { uuid: uid },
      { $set: { isRead: true } }
    );
  };

  genFetchAllRawForUserX = async (userId: string): Promise<Array<Object>> => {
    return await MongoNotificationCollection.find({
      ownerUuid: userId,
    }).toArray();
  };
}
