import { describe, expect, it } from "@jest/globals";

import { Logger } from "../../logger";
import { MockNotification } from "../../__mocks__/MockNotification";
import { InMemoryNotificationRepository } from "../../repositories/inMemory/inMemoryNotificationRepository";
import { InMemoryUserNotificationMetadataRepository } from "../../repositories/inMemory/inMemoryUserNotificationMetadataRepository";
import { NotificationService } from "../notification.service";

describe("NotificationService", () => {
  const ownerId = "owner__0001"; // receiver / owner of the notification
  const viewerId = "viewer__0001"; // sender of the notification
  let notificationRepository: InMemoryNotificationRepository;
  let notificationUserMetdataRepository: InMemoryUserNotificationMetadataRepository;
  const notif = MockNotification.new(ownerId, viewerId);

  const originalConsoleError = console.error;

  beforeAll(() => {
    notificationRepository = new InMemoryNotificationRepository();
    notificationUserMetdataRepository =
      new InMemoryUserNotificationMetadataRepository();

    // Mock console.error to prevent error logs from appearing in the console
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  let sendersNotificationService: NotificationService;
  let ownersNotificationService: NotificationService;

  it("should create two notification service instances", async () => {
    sendersNotificationService = new NotificationService(
      viewerId,
      notificationRepository,
      notificationUserMetdataRepository,
      [MockNotification],
      new Logger()
    );
    ownersNotificationService = new NotificationService(
      ownerId,
      notificationRepository,
      notificationUserMetdataRepository,
      [MockNotification],
      new Logger()
    );

    expect(sendersNotificationService).toBeDefined();
    expect(ownersNotificationService).toBeDefined();
  });

  it("should create a notification", async () => {
    await sendersNotificationService.genSave(notif);
    // Using repository to test the save method only
    // Test notification service fetch in a separate test
    const fetchedNotification = await notificationRepository.genFetchX(
      notif.uid
    );
    expect(fetchedNotification).toEqual(notif);
  });

  it("shouldn't mark a notification as read when user doesn't have permission", async () => {
    // Test for sender
    try {
      await sendersNotificationService.genMarkAsReadX(notif.uid);
      const fetchedNotification = await notificationRepository.genFetchX(
        notif.uid
      );
      expect(fetchedNotification?.isRead).toBe(false);
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });

  it("should mark a notification as read when user has permission", async () => {
    // Test for owner
    await ownersNotificationService.genMarkAsReadX(notif.uid);
    const fetchedNotification = await notificationRepository.genFetchX(
      notif.uid
    );
    expect(fetchedNotification?.isRead).toBe(true);
  });

  test("sender can't  delete a notification", async () => {
    const isDeleted = await sendersNotificationService.genDeleteNotificationX(
      notif.uid
    );
    expect(isDeleted).toBe(false);

    const fetchedNotification = await notificationRepository.genFetchX(
      notif.uid
    );
    expect(fetchedNotification).toEqual({
      ...notif,
      isRead: true,
    });
  });

  test("owner can delete a notification", async () => {
    const isDeleted = await ownersNotificationService.genDeleteNotificationX(
      notif.uid
    );
    expect(isDeleted).toBe(true);

    const fetchedNotification = await notificationRepository.genFetchX(
      notif.uid
    );
    expect(fetchedNotification).toBeNull();
  });

  test("force delete a notification", async () => {
    const notif2 = MockNotification.new(ownerId, viewerId);
    await sendersNotificationService.genSave(notif2);
    const isDeleted =
      await sendersNotificationService.genDeleteNotificationBypassingPermCheck(
        notif2.uid
      );
    expect(isDeleted).toBe(true);

    const fetchedNotif2 = await notificationRepository.genFetchX(notif2.uid);
    expect(fetchedNotif2).toBeNull();
  });

  test("fetch all notifications for a user", async () => {
    const notif1 = MockNotification.new(ownerId, viewerId, "test 1");
    const notif2 = MockNotification.new(ownerId, viewerId, "test 2");
    await Promise.all([
      sendersNotificationService.genSave(notif1),
      sendersNotificationService.genSave(notif2),
    ]);

    const notifications =
      await ownersNotificationService.genFetchAllResponseForUserX();

    expect(notifications.length).toBe(2);

    expect(notifications).toEqual([
      {
        notification: notif1.toINotification(),
        customResponseField: "custom-response",
      },
      {
        notification: notif2.toINotification(),
        customResponseField: "custom-response",
      },
    ]);
  });
});
