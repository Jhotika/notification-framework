import { Logger } from "../../lib/logger";
import { NotificationFrameworkBuilder } from "../../lib/notificationFramework.builder";
import { INotificationFramework } from "../../lib/index";
import { Collection } from "mongodb";
import { AbstractNotification } from "../../lib/models/abstractNotification";

/**
 * This file contains examples of how to use the NotificationFrameworkBuilder
 * to create a NotificationFramework instance with different configurations.
 **/

/**
 * Example 1: Create a NotificationFramework instance with MongoDB configuration.
 * This example creates a NotificationFramework instance with MongoDB configuration.
 **/
export const nfWithMongoDb = (): INotificationFramework => {
  const framework = new NotificationFrameworkBuilder()
    .withLogger(new Logger())
    .withMongoDbConfig({
      clusterUri: "mongodb://localhost:27017",
      db: "notifications",
      user: "admin",
      password: "password",
    })
    .build();
  return framework;
};

/**
 * Example 2: Create a NotificationFramework instance with MongoDB collections.
 * This example creates a NotificationFramework instance with MongoDB collections.
 **/
export const nfWithMongoCollections = (
  notificationCollection: Collection<AbstractNotification<string>>,
  userNotificationMetadataCollection: Collection
): INotificationFramework => {
  const framework = new NotificationFrameworkBuilder()
    .withLogger(new Logger())
    .withMongoCollectionConfig({
      notificationCollection,
      userNotificationMetadataCollection,
    })
    .build();
  return framework;
};

/**
 * Example 3: Create a NotificationFramework instance with InMemoryDb configuration.
 * This example creates a NotificationFramework instance with InMemoryDb configuration.
 **/
export const nfWithInMemory = (): INotificationFramework => {
  const framework = new NotificationFrameworkBuilder()
    .withLogger(new Logger())
    .withInMemoryDbConfig({})
    .build();
  return framework;
};
