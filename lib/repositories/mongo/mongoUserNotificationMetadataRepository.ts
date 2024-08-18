import {
  IUserNotificationMetadata,
  IUserNotificationMetadataRepository,
} from "../IUserNotificationMetadataRepository";
import {
  MongoNotificationCollection,
  MongoNotificationUserMetadataCollection,
} from "./mongoCollections";

export class MongoUserNotificationMetadataRepository
  implements IUserNotificationMetadataRepository
{
  constructor(public readonly viewerId: string) {}

  genFetchLatestCreationTimeForUserX = async (): Promise<number> => {
    const notifications = await MongoNotificationCollection.find({
      ownerUuid: this.viewerId,
    })
      .sort({ createTime: -1 })
      .limit(1)
      .toArray();
    return notifications.length > 0 ? notifications[0].createdAt : 0;
  };

  genUpdateWatermarkForUserX = async (): Promise<void> => {
    const lastFetchTime = Date.now();
    await MongoNotificationUserMetadataCollection.updateOne(
      { userId: this.viewerId },
      { $set: { lastFetchTime: lastFetchTime } },
      { upsert: true }
    );
  };

  genFetchUserMetadataX = async (): Promise<IUserNotificationMetadata> => {
    const userMetadata = await MongoNotificationUserMetadataCollection.findOne({
      userId: this.viewerId,
    });
    return {
      userId: this.viewerId,
      lastFetchTime: userMetadata?.lastFetchTime ?? 0,
    };
  };

  genFetchNumUnreadNotificationsX = async (): Promise<number> => {
    return await MongoNotificationCollection.countDocuments({
      ownerUuid: this.viewerId,
      isRead: false,
    });
  };
}
