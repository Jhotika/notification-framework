export interface IUserNotificationMetadata {
  userId: string;
  latestNotifCreateTime: number;
  lastFetchTime: number;
}

export interface IPrivacyUnsafe {}

export interface IUserNotificationMetadataRepository extends IPrivacyUnsafe {
  // genFetchLatestCreationTimeForUserX is a method that fetches the latest creation time for a user
  // Returns 0 if the user does not exist
  genFetchLatestCreationTimeForUserX(userId: string): Promise<number>;

  // Returns an object with the latest notification creation time and the last fetch time
  genFetchUserMetadataX(userId: string): Promise<IUserNotificationMetadata>;

  // genUpdateWatermarkForUserX is a method that updates the watermark for a user
  genUpdateWatermarkForUserX(userId: string): Promise<void>;
}
