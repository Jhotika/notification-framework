import { describe, expect, it } from "@jest/globals";

import { Logger } from "../../logger";
import { MockNotification } from "../../__mocks__/MockNotification";
import { InMemoryNotificationRepository } from "../../repositories/inMemory/inMemoryNotificationRepository";
import { InMemoryUserNotificationMetadataRepository } from "../../repositories/inMemory/inMemoryUserNotificationMetadataRepository";
import { NotificationService } from "../notification.service";
import { UserNotificationMetadataService } from "../userNotificationMetadata.service";

describe("UserNotificationMetadataService", () => {
  const ownerId = "owner__0001"; // receiver / owner of the notification
  const viewerId = "viewer__0001"; // sender of the notification
  let notificationRepository: InMemoryNotificationRepository;
  let notificationUserMetdataRepository: InMemoryUserNotificationMetadataRepository;

  let sendersNotificationService: NotificationService;
  let ownersNotificationService: NotificationService;

  const originalConsoleError = console.error;

  beforeAll(() => {
    notificationRepository = new InMemoryNotificationRepository();
    notificationUserMetdataRepository =
      new InMemoryUserNotificationMetadataRepository();

    sendersNotificationService = new NotificationService(
      viewerId,
      notificationRepository,
      notificationUserMetdataRepository,
      [MockNotification], // enabled concrete notification classes
      new Logger()
    );
    ownersNotificationService = new NotificationService(
      ownerId,
      notificationRepository,
      notificationUserMetdataRepository,
      [MockNotification], // enabled concrete notification classes
      new Logger()
    );
    // Mock console.error to prevent error logs from appearing in the console
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  let ownersUserNotificationMetadataService: UserNotificationMetadataService;

  it("should create an instance of userNotificationMetadata service instance", async () => {
    ownersUserNotificationMetadataService = new UserNotificationMetadataService(
      ownerId,
      notificationUserMetdataRepository,
      new Logger()
    );

    expect(ownersUserNotificationMetadataService).toBeDefined();
  });

  it("should fetch all notifications for user", async () => {
    const notifications =
      await ownersNotificationService.genFetchAllResponseForUserX(null);
    expect(notifications).toEqual([]);
  });

  it("should have new notification", async () => {
    // create a new notification
    const notif = MockNotification.new(ownerId, viewerId);
    await sendersNotificationService.genSave(notif);
    const hasNewNotif =
      await ownersUserNotificationMetadataService.genIfUserHasNewNotificationX();
    expect(hasNewNotif).toBe(true);
  });

  it("should update watermark for user", async () => {
    const curTime = Date.now();
    await ownersUserNotificationMetadataService.genUpdateWatermarkForUserX();
    const userMetadata =
      await notificationUserMetdataRepository.genFetchUserMetadataX(ownerId);
    expect(userMetadata.lastFetchTime).toBeGreaterThanOrEqual(curTime);
  });

  it("should have the correct latest creation time for user", async () => {
    const notif2 = MockNotification.new(ownerId, viewerId);
    await sendersNotificationService.genSave(notif2);
    const latestCreationTime =
      await notificationUserMetdataRepository.genFetchLatestCreationTimeForUserX(
        ownerId
      );
    expect(latestCreationTime).toEqual(notif2.createdAt);
  });
});
