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
  constructor(
    public readonly viewerId: string,
    private readonly notificationCollection = MongoNotificationCollection,
    private readonly userMetadataCollection = MongoNotificationUserMetadataCollection
  ) {}

  genFetchLatestCreationTimeForUserX = async (): Promise<number> => {
    const notifications = await this.notificationCollection
      .find({
        ownerUuid: this.viewerId,
      })
      .sort({ createTime: -1 })
      .limit(1)
      .toArray();
    return notifications.length > 0 ? notifications[0].createdAt : 0;
  };

  genUpdateWatermarkForUserX = async (): Promise<void> => {
    const lastFetchTime = Date.now();
    await this.userMetadataCollection.updateOne(
      { userId: this.viewerId },
      { $set: { lastFetchTime: lastFetchTime } },
      { upsert: true }
    );
  };

  genFetchUserMetadataX = async (): Promise<IUserNotificationMetadata> => {
    const userMetadata = await this.userMetadataCollection.findOne({
      userId: this.viewerId,
    });
    return {
      userId: this.viewerId,
      lastFetchTime: userMetadata?.lastFetchTime ?? 0,
    };
  };

  genFetchNumUnreadNotificationsX = async (): Promise<number> => {
    return await this.notificationCollection.countDocuments({
      ownerUuid: this.viewerId,
      isRead: false,
    });
  };
}
