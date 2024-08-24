import { Collection } from "mongodb";
import { INotification } from "../../models/abstractNotification";
import {
  IUserNotificationMetadata,
  IUserNotificationMetadataRepository,
} from "../IUserNotificationMetadataRepository";

export class MongoUserNotificationMetadataRepository
  implements IUserNotificationMetadataRepository
{
  private constructor(
    private readonly notificationCollection: Collection<INotification<string>>,
    private readonly userMetadataCollection: Collection
  ) {}

  static fromCollections = (
    notificationCollection: Collection<INotification<string>>,
    userMetadataCollection: Collection
  ): MongoUserNotificationMetadataRepository => {
    return new MongoUserNotificationMetadataRepository(
      notificationCollection,
      userMetadataCollection
    );
  };

  genFetchLatestCreationTimeForUserX = async (
    userId: string
  ): Promise<number> => {
    const notifications = await this.notificationCollection
      .find({
        ownerUid: userId,
      })
      .sort({ createTime: -1 })
      .limit(1)
      .toArray();
    return notifications.length > 0 ? notifications[0].createdAt : 0;
  };

  genUpdateWatermarkForUserX = async (userId: string): Promise<void> => {
    const lastFetchTime = Date.now();
    await this.userMetadataCollection.updateOne(
      { userId },
      { $set: { lastFetchTime } },
      { upsert: true }
    );
  };

  genFetchUserMetadataX = async (
    userId: string
  ): Promise<IUserNotificationMetadata> => {
    const userMetadata = await this.userMetadataCollection.findOne({
      userId: userId,
    });
    return {
      userId: userId,
      lastFetchTime: userMetadata?.lastFetchTime ?? 0,
    };
  };

  genFetchNumUnreadNotificationsX = async (userId: string): Promise<number> => {
    return await this.notificationCollection.countDocuments({
      ownerUid: userId,
      isRead: false,
    });
  };
}
