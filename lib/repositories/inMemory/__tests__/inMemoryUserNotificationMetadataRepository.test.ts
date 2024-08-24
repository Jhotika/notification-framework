import { InMemoryUserNotificationMetadataRepository } from "../inMemoryUserNotificationMetadataRepository";

import { describe, expect, it } from "@jest/globals";
import { InMemoryNotificationRepository } from "../inMemoryNotificationRepository";
import { MockNotification } from "../../../__mocks__/MockNotification";

describe("InMemory", () => {
  const viewerId = "viewer__0001";
  const repository = new InMemoryUserNotificationMetadataRepository();
  const notifRepository = new InMemoryNotificationRepository();
  const senderUuid = "sender__0001";
  const notification = MockNotification.new(
    viewerId,
    senderUuid,
    "customValue"
  );
  notifRepository.genCreateX(notification);
  it("should fetch the latest notification creation time for user", async () => {
    const newerNotif = MockNotification.new(
      viewerId,
      senderUuid,
      "random customValue"
    );

    notifRepository.genCreateX(newerNotif);

    const someoneElsesNotif = MockNotification.new(
      "someone_elses_id",
      senderUuid,
      "foo"
    );
    const someoneElsesRepo = new InMemoryNotificationRepository();
    someoneElsesRepo.genCreateX(someoneElsesNotif);
    await repository.genFetchLatestCreationTimeForUserX(viewerId);
    const fetchedNotification =
      await repository.genFetchLatestCreationTimeForUserX(viewerId);
    expect(fetchedNotification).toEqual(newerNotif.createdAt);
  });

  it("should update the watermark for user", async () => {
    const timeNow = Date.now();
    await repository.genUpdateWatermarkForUserX(viewerId);
    const fetchedMetadata = await repository.genFetchUserMetadataX(viewerId);
    expect(fetchedMetadata.lastFetchTime).toBeGreaterThanOrEqual(timeNow);
  });

  it("should fetch the user metadata", async () => {
    const fetchedMetadata = await repository.genFetchUserMetadataX(viewerId);
    expect(fetchedMetadata.userId).toEqual(viewerId);

    // Check that the metadata is updated with watermark update
    await repository.genUpdateWatermarkForUserX(viewerId);
    const fetchedMetadata2 = await repository.genFetchUserMetadataX(viewerId);
    expect(fetchedMetadata2.lastFetchTime).toBeGreaterThanOrEqual(
      fetchedMetadata.lastFetchTime
    );
  });

  it("should fetch number of unread notifications", async () => {
    const fetchedNum = await repository.genFetchNumUnreadNotificationsX(
      viewerId
    );
    expect(fetchedNum).toEqual(2); // notification + newerNotif
    await notifRepository.genMarkAsReadX(notification.uid);
    const fetchedNum2 = await repository.genFetchNumUnreadNotificationsX(
      viewerId
    );
    expect(fetchedNum2).toEqual(1); // only newerNotif
  });
});
