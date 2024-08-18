import { MongoClient, ServerApiVersion, Db, Collection } from "mongodb";
import dotenv from "dotenv";
import { AbstractNotification } from "../../models/abstractNotification";

dotenv.config();

const password = process.env.MONGO_PASSWORD || ""; // Critical: Make sure to set MONGO_PASSWORD in your .env file
const user = process.env.MONGO_USER || ""; // Critical: Make sure to set MONGO_USER in your .env file
const mongoClusterUri = process.env.MONGO_CLUSTER_URI || ""; // Critical: Make sure to set MONGO_CLUSTER_URI in your .env file
const prodDb = process.env.MONGO_DB || ""; // Critical: Make sure to set MONGO_DB in your .env file

if (!password || !user || !mongoClusterUri || !prodDb) {
  throw new Error(
    "Missing critical environment variables. Please check your .env file."
  );
}

const mongoDbClient = new MongoClient(mongoClusterUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const MONGO_NOTIFICATION_COLLECTION_NAME = "notification_collection";
const MONGO_NOTIFICATION_USER_METADATA_COLLECTION_NAME =
  "notification_user_metadata_collection";

let MongoNotificationCollection: Collection<AbstractNotification>;
let MongoNotificationUserMetadataCollection: Collection;

mongoDbClient
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
    const mongoDb = mongoDbClient.db(prodDb);
    MongoNotificationCollection = mongoDb.collection<AbstractNotification>(
      MONGO_NOTIFICATION_COLLECTION_NAME
    );
    MongoNotificationUserMetadataCollection = mongoDb.collection(
      MONGO_NOTIFICATION_USER_METADATA_COLLECTION_NAME
    );
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
    process.exit(1);
  });

const disconnectFromMongoDB = async () => {
  try {
    await mongoDbClient.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
};

process.on("SIGINT", disconnectFromMongoDB);
process.on("SIGTERM", disconnectFromMongoDB);

export { MongoNotificationCollection, MongoNotificationUserMetadataCollection };
