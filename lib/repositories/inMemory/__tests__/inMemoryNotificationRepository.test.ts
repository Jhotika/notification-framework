import { InMemoryNotificationRepository } from "../inMemoryNotificationRepository";

import { describe, expect, it } from "@jest/globals";
import { MockNotification } from "./MockNotification";

describe("InMemoryNotificationRepository", () => {
  const viewerId = "viewer__0001";
  let notificationRepository: InMemoryNotificationRepository;
  const senderUuid = "sender__0001";
  const notification = new MockNotification(
    "1", // uuid
    "type",
    {},
    viewerId,
    senderUuid,
    false,
    Date.now(),
    "customValue"
  );

  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository(viewerId);
  });

  it("should create a notification", async () => {
    await notificationRepository.genCreateX(notification);
    const fetchedNotification = await notificationRepository.genFetchX(
      notification.uuid
    );
    expect(fetchedNotification).toEqual(notification);
  });

  it("should fetch a notification", async () => {
    const fetchedNotification = await notificationRepository.genFetchX(
      notification.uuid
    );
    expect(fetchedNotification).toEqual(notification);
  });

  it("should mark a notification as read", async () => {
    await notificationRepository.genMarkAsReadX(notification.uuid);
    const fetchedNotification = await notificationRepository.genFetchX(
      notification.uuid
    );
    expect(fetchedNotification?.isRead).toBe(true);
  });

  it("should fetch all notifications for a user", async () => {
    const notification2 = new MockNotification(
      "2", // different uuid
      "type",
      {},
      viewerId,
      senderUuid,
      false,
      Date.now(),
      "random customValue"
    );
    const notificationAnotherUser = new MockNotification(
      "rand_uuid_user_2", // some random uuid
      "type",
      {},
      "random_user_id",
      senderUuid,
      false,
      Date.now(),
      "some other value"
    );
    const anotherNotificationRepository = new InMemoryNotificationRepository(
      "random_user_id"
    );
    await anotherNotificationRepository.genCreateX(notificationAnotherUser);
    await notificationRepository.genCreateX(notification2);
    const notifications =
      await notificationRepository.genFetchAllRawForViewerX();
    expect(notifications).toEqual([notification, notification2]);
  });

  it("should mark all notifications as read", async () => {
    const notification3 = new MockNotification(
      "3", // different uuid
      "type",
      {},
      viewerId,
      senderUuid,
      false,
      Date.now(),
      "bar"
    );
    await notificationRepository.genCreateX(notification3);
    await notificationRepository.genMarkAllAsReadX();
    const allNotifs = await notificationRepository.genFetchAllRawForViewerX();
    expect(allNotifs.every((n) => n.isRead)).toBe(true);
  });
});
