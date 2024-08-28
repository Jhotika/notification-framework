import { Collection } from "mongodb";
import { INotification } from "../../models/abstractNotification";
import { INotificationRepository } from "../INotificationRepository";
import { IPrivacyUnsafe } from "../IUserNotificationMetadataRepository";
import { ILogger, Logger } from "../../logger";

export class MongoNotificationRepository
  implements INotificationRepository, IPrivacyUnsafe
{
  private static instance: MongoNotificationRepository | null;
  private constructor(
    private readonly collection: Collection<INotification<string>>,
    public logger: ILogger = new Logger()
  ) {}

  static fromCollectionX = (
    collection: Collection<INotification<string>>
  ): MongoNotificationRepository => {
    if (!MongoNotificationRepository.instance) {
      MongoNotificationRepository.instance = new MongoNotificationRepository(
        collection
      );
    } else if (
      MongoNotificationRepository?.instance?.collection &&
      MongoNotificationRepository.instance.collection !== collection
    ) {
      throw new Error(
        "MongoNotificationRepository.fromCollection called with different collection" +
          collection +
          " " +
          MongoNotificationRepository.instance?.collection
      );
    }
    return MongoNotificationRepository.instance;
  };

  genCreateX = async (notification: INotification): Promise<void> => {
    await this.collection.insertOne(notification);
  };

  genFetchX = async (notificationUid: string): Promise<Object | null> => {
    return await this.collection.findOne({
      uid: notificationUid,
    });
  };

  genMarkAllAsReadX = async (ownerUid: string): Promise<void> => {
    await this.collection.updateMany({ ownerUid }, { $set: { isRead: true } });
  };

  genMarkAsReadX = async (uid: string): Promise<void> => {
    await this.collection.updateOne({ uid }, { $set: { isRead: true } });
  };

  genFetchAllRawForViewerX = async (
    viewerUid: string,
    lastFetchTimeInMs: number | null
  ): Promise<Array<Object>> => {
    return await this.collection
      .find({
        ownerUid: viewerUid,
        createdAt: { $gt: lastFetchTimeInMs ?? 0 },
      })
      .toArray();
  };

  genDeleteX = async (uid: string): Promise<void> => {
    await this.collection.deleteOne({ uuid: uid });
  };
}
