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
  private static instance: IRepository | null = null;
  private static config: IDatabaseConfig | null = null;

  static getRepositoryX = (dbConfig: IDatabaseConfig): IRepository => {
    if (RepositoryFactory.instance != null) {
      if (RepositoryFactory.config === dbConfig) {
        return RepositoryFactory.instance;
      } else {
        throw new Error(
          "Repository already initialized with different configuration settings. Existing config:" +
            JSON.stringify(RepositoryFactory.config) +
            "\n New config: \n" +
            JSON.stringify(dbConfig)
        );
      }
    }
    RepositoryFactory.config = dbConfig;
    const dbType: string = dbConfig.type ?? process.env.ENABLED_DB_TYPE ?? "";
    let repository: IRepository;
    switch (dbType) {
      case DatabaseType.MongoDocuments:
        const config = dbConfig.config as IMongoCollectionConfig;
        repository = {
          notificationRepository: MongoNotificationRepository.fromCollectionX(
            config.notificationCollection
          ),
          userNotificationMetadataRepository:
            MongoUserNotificationMetadataRepository.fromCollections(
              config.notificationCollection,
              config.userNotificationMetadataCollection
            ),
        };
        break;
      case DatabaseType.InMemory:
        repository = {
          notificationRepository: new InMemoryNotificationRepository(),
          userNotificationMetadataRepository:
            new InMemoryUserNotificationMetadataRepository(),
        };
        break;
      default:
        throw new DatabaseNotSupportedError(
          `Database type ${dbType} is not supported`
        );
    }
    RepositoryFactory.instance = repository;
    return repository;
  };
}
