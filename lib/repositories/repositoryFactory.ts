import {
  type IDatabaseConfig,
  DatabaseType,
} from "../configs/db/database.config";
import { MongoNotificationRepository } from "./mongo/mongoNotificationRepository";
import { MongoUserNotificationMetadataRepository } from "./mongo/mongoUserNotificationMetadataRepository";
import { INotificationRepository } from "./INotificationRepository";
import { IUserNotificationMetadataRepository } from "./IUserNotificationMetadataRepository";

import { DatabaseNotSupportedError } from "../errors/databaseNotSupportedError";
import { type IMongoCollectionConfig } from "../configs/db/mongoCollection.config";
import { InMemoryNotificationRepository } from "./inMemory/inMemoryNotificationRepository";
import { InMemoryUserNotificationMetadataRepository } from "./inMemory/inMemoryUserNotificationMetadataRepository";

export interface IRepository {
  notificationRepository: INotificationRepository;
  userNotificationMetadataRepository: IUserNotificationMetadataRepository;
}

export class RepositoryFactory {
  /**
   * Factory method to get the notification repositories based on the enabled database type.
   * @param enabledDbType: DatabaseType
   * @returns An object containing the notification repositories.
   * @throws DatabaseNotSupportedError
   */
  static getRepositoryX = (dbConfig: IDatabaseConfig): IRepository => {
    const dbType: string = dbConfig.type ?? process.env.ENABLED_DB_TYPE ?? "";
    switch (dbType) {
      case DatabaseType.MongoDocuments:
        const config = dbConfig.config as IMongoCollectionConfig;
        return {
          notificationRepository: MongoNotificationRepository.fromCollectionX(
            config.notificationCollection
          ),
          userNotificationMetadataRepository:
            MongoUserNotificationMetadataRepository.fromCollections(
              config.notificationCollection,
              config.userNotificationMetadataCollection
            ),
        };
      case DatabaseType.InMemory:
        return {
          notificationRepository: new InMemoryNotificationRepository(),
          userNotificationMetadataRepository:
            new InMemoryUserNotificationMetadataRepository(),
        };
      default:
        throw new DatabaseNotSupportedError(
          `Database type ${dbType} is not supported`
        );
    }
  };
}
