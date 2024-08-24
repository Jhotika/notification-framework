import { InMemoryNotificationRepository } from "../inMemoryNotificationRepository";

import { describe, expect, it } from "@jest/globals";
import { MockNotification } from "../../../__mocks__/MockNotification";

describe("InMemoryNotificationRepository", () => {
  const viewerId = "viewer__0001";
  let notificationRepository: InMemoryNotificationRepository;
  const senderUuid = "sender__0001";
  const notification = MockNotification.new(
    viewerId,
    senderUuid,
    "customValue"
  );

  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
  });

  it("should create a notification", async () => {
    await notificationRepository.genCreateX(notification);
    const fetchedNotification = await notificationRepository.genFetchX(
      notification.uid
    );
    expect(fetchedNotification).toEqual(notification);
  });

  it("should fetch a notification", async () => {
    const fetchedNotification = await notificationRepository.genFetchX(
      notification.uid
    );
    expect(fetchedNotification).toEqual(notification);
  });

  it("should mark a notification as read", async () => {
    await notificationRepository.genMarkAsReadX(notification.uid);
    const fetchedNotification = await notificationRepository.genFetchX(
      notification.uid
    );
    expect(fetchedNotification?.isRead).toBe(true);
  });

  it("should fetch all notifications for a user", async () => {
    const notification2 = MockNotification.new(
      viewerId,
      senderUuid,
      "random customValue"
    );
    const notificationAnotherUser = MockNotification.new(
      "random_user_id",
      senderUuid,
      "some other value"
    );
    const anotherNotificationRepository = new InMemoryNotificationRepository();
    await anotherNotificationRepository.genCreateX(notificationAnotherUser);
    await notificationRepository.genCreateX(notification2);
    const notifications = await notificationRepository.genFetchAllRawForViewerX(
      viewerId
    );
    expect(notifications).toEqual([notification, notification2]);
  });

  it("should mark all notifications as read", async () => {
    const notification3 = MockNotification.new(viewerId, senderUuid, "bar");
    await notificationRepository.genCreateX(notification3);
    await notificationRepository.genMarkAllAsReadX();
    const allNotifs = await notificationRepository.genFetchAllRawForViewerX(
      viewerId
    );
    expect(allNotifs.every((n) => n.isRead)).toBe(true);
  });
});
