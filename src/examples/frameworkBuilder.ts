import { Logger } from "../../lib/logger";
import { NotificationFrameworkBuilder } from "../../lib/notificationFramework.builder";
import { INotificationFramework } from "../../lib/index";
import { Collection } from "mongodb";
import { INotification } from "../../lib/models/abstractNotification";
import { MockNotification } from "../../lib/__mocks__/MockNotification";

/**
 * This file contains examples of how to use the NotificationFrameworkBuilder
 * to create a NotificationFramework instance with different configurations.
 **/

/**
 * Example 1: Create a NotificationFramework instance with MongoDB collections.
 * This example creates a NotificationFramework instance with MongoDB collections.
 **/
export const nfWithMongoCollections = (
  notificationCollection: Collection<INotification<string>>,
  userNotificationMetadataCollection: Collection
): INotificationFramework => {
  const framework = new NotificationFrameworkBuilder()
    .withLogger(new Logger())
    .withMongoCollectionConfig({
      notificationCollection,
      userNotificationMetadataCollection,
    })
    .withConcreteNotificationClasses([MockNotification])
    .buildX();
  return framework;
};

/**
 * Example 2: Create a NotificationFramework instance with InMemoryDb configuration.
 * This example creates a NotificationFramework instance with InMemoryDb configuration.
 **/
export const nfWithInMemory = (): INotificationFramework => {
  const framework = new NotificationFrameworkBuilder()
    .withLogger(new Logger())
    .withInMemoryDbConfig({})
    .withConcreteNotificationClasses([MockNotification])
    .buildX();
  return framework;
};

export const servicesFromFramework = () => {
  const framework = nfWithInMemory();
  const notificationService =
    framework.getNotificationServiceX("dummy-user-uid");
  const userNotificationMetadataService =
    framework.getUserNotificationMetadataServiceX("dummy-user-uid");
  return { notificationService, userNotificationMetadataService };
};
