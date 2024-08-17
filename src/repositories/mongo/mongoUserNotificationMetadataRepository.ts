import {
  IUserNotificationMetadata,
  IUserNotificationMetadataRepository,
} from "../IUserNotificationMetadataRepository";
import { MongoNotificationUserMetadataCollection } from "./mongoCollections";

export class MongoUserNotificationMetadataRepository
  implements IUserNotificationMetadataRepository
{
  genFetchLatestCreationTimeForUserX = async (
    userId: string
  ): Promise<number> => {
    const userMetadata = await MongoNotificationUserMetadataCollection.findOne({
      userId: userId,
    });
    return userMetadata?.latestNotifCreateTime ?? 0;
  };

  genUpdateWatermarkForUserX = async (userId: string): Promise<void> => {
    const lastFetchTime = Date.now();
    await MongoNotificationUserMetadataCollection.updateOne(
      { userId: userId },
      { $set: { lastFetchTime: lastFetchTime } },
      { upsert: true }
    );
  };

  genFetchUserMetadataX = async (
    userId: string
  ): Promise<IUserNotificationMetadata> => {
    const userMetadata = await MongoNotificationUserMetadataCollection.findOne({
      userId: userId,
    });
    return {
      userId: userId,
      latestNotifCreateTime: userMetadata?.latestNotifCreateTime ?? 0,
      lastFetchTime: userMetadata?.lastFetchTime ?? 0,
    };
  };
}
