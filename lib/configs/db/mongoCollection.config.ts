import { Collection } from "mongodb";
import { INotification } from "../../models/abstractNotification";
import { AbstractDbConfig } from "./abstractDb.config";

export interface IMongoCollectionConfig {
  notificationCollection: Collection<INotification<string>>;
  userNotificationMetadataCollection: Collection;
}

export const dbType = "mongo-collections";

export class MongoCollectionConfig extends AbstractDbConfig {
  constructor(public readonly dbType: string) {
    super();
  }

  static verifyConfigX = (config: IMongoCollectionConfig): void => {
    const missingFields: string[] = [];
    if (!config.notificationCollection) {
      missingFields.push("Notification collection");
    }
    if (!config.userNotificationMetadataCollection) {
      missingFields.push("User notification metadata collection");
    }
    if (missingFields.length > 0) {
      throw new Error(
        `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "is" : "are"
        } required`
      );
    }
  };
}
