import { DatabaseType } from "../configs/database.config";
import { MongoNotificationRepository } from "./mongo/mongoNotificationRepository";
import { MongoUserNotificationMetadataRepository } from "./mongo/mongoUserNotificationMetadataRepository";
import { INotificationRepository } from "./INotificationRepository";
import { IUserNotificationMetadataRepository } from "./IUserNotificationMetadataRepository";

import { DatabaseNotSupportedError } from "../errors/databaseNotSupportedError";

export class RepositoryFactory {
  /**
   * This method is used to get the repository based on the database type
   * If the database type is not provided, it will use the ENABLED_DB_TYPE
   * from the environment variables. If that is also not provided, it will
   * throw an error.
   * @param enabledDbType: DatabaseType
   * @returns An object containing the notification repositories.
   * @throws DatabaseNotSupportedError
   */
  static getRepositoryX = (
    enabledDbType?: DatabaseType
  ): {
    notificationRepository: INotificationRepository;
    userNotificationMetadataRepository: IUserNotificationMetadataRepository;
  } => {
    const dbType: string = enabledDbType ?? process.env.ENABLED_DB_TYPE ?? "";
    switch (dbType) {
      case DatabaseType.MongoDB:
        return {
          notificationRepository: new MongoNotificationRepository(),
          userNotificationMetadataRepository:
            new MongoUserNotificationMetadataRepository(),
        };
      default:
        throw new DatabaseNotSupportedError(
          `Database type ${dbType} is not supported`
        );
    }
  };
}
