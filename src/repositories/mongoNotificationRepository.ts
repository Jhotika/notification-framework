import { INotificationRepository } from "./INotificationRepository";
import { MongoNotificationCollection } from "./mongoCollections";

export class MongoNotificationRepository implements INotificationRepository {
  genCreateX = async (notification: Object): Promise<void> => {
    await MongoNotificationCollection.insertOne(notification);
  };

  genFetchX = async (
    userId: string,
    notificationUid: string
  ): Promise<Object> => {
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
