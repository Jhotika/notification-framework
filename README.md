# Notification Framework

This Framework provides a convenient interface and essential features for managing notifications within your application.

## Table of Contents

- [Notification Framework](#notification-framework)
  - [Table of Contents](#table-of-contents)
  - [Roadmap](#roadmap)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [Builder Pattern](#builder-pattern)
  - [Configuration](#configuration)
    - [Mongo Collections](#mongo-collections)
    - [In-Memory Database](#in-memory-database)
- [For Developers](#for-developers)
  - [Contributing](#contributing)
  - [Code Guidelines](#code-guidelines)
  - [License](#license)

## Roadmap

Our journey to version 1.0.0 includes:

1. **Testing**:

   - Expand unit tests coverage.
   - Add integration tests by integrating the framework into a Node.js project to demonstrate its functionality.

2. **Documentation**:

   - Improve and expand documentation.
   - Include detailed examples and usage scenarios.

3. **More Examples**:

   - Provide additional examples showcasing different configurations and use cases.

4. **Community Feedback**:
   - Gather feedback from early adopters to refine features and fix bugs.

## Features

- Interfaces for managing notifications and user-notification features.
- Singleton pattern to ensure a single instance with consistent configuration.
- Supports multiple database configurations, including Mongo collections, and in-memory databases (more options to come).
- Provides access to `NotificationService` and `UserNotificationMetadataService` for managing notifications and metadata.

## Installation

1. Clone the Git repository:

   ```bash
   git clone https://github.com/Jhotika/notification-framework
   ```

2. Install the dependencies using npm:

   ```bash
   npm install
   ```

   or yarn:

   ```bash
   yarn install
   ```

## Usage

### Basic Usage

To use the `NotificationFramework`, initialize it with a logger (optional) and a database configuration.

```typescript
import NotificationFramework from "notification-framework/lib";
import { DatabaseType } from "notification-framework/lib/configs/db/database.config";
import { Logger } from "path/to/your/logger"; // Example logger

const dbConfig = {
  type: DatabaseType.MongoDocuments,
  config: {
    // MongoDB configuration here
  },
};
// optional logger
const logger = new Logger();

const framework = NotificationFramework.getInstanceX(
  dbConfig,
  [MockNotification], // list of your concrete notification classes
  logger // optional
);

// Use the framework to get services
const notificationService = framework.getNotificationServiceX("viewerId");
const userMetadataService =
  framework.getUserNotificationMetadataServiceX("viewerId");
```

### Builder Pattern

You can also use the `NotificationFrameworkBuilder` to configure and create the framework instance.

```typescript
import { NotificationFrameworkBuilder } from "notification-framework/lib";
import { Logger } from "path/to/your/logger"; // Example logger

const builder = new NotificationFrameworkBuilder()
  .withMongoCollectionConfig({
    notificationCollection, // your notification collection
    userNotificationMetadataCollection, // your notification metadata collection
  })
  .withConcreteNotificationClasses([MockNotification]) // list of your concrete notification classes
  .withLogger(new Logger()); // optional

const framework = builder.buildX();

// Use the framework to get services
const notificationService = framework.getNotificationServiceX("viewerId");
const userMetadataService =
  framework.getUserNotificationMetadataServiceX("viewerId");
```

## Configuration

### Mongo Collections

To configure the framework with Mongo collections:

```typescript
import { IMongoCollectionConfig } from "notification-framework/lib/configs/db/mongoCollection.config";

const mongoCollectionsConfig: IMongoCollectionConfig = {
  notificationCollection: your-mongo-collection-for-notifications,
  userNotificationMetadataCollection: your-mongo-collection-for-metadata,
};
```

### In-Memory Database

For in-memory database configuration:

```typescript
import { IInMemoryConfig } from "notification-framework/lib/configs/db/inMemory.config";

const inMemoryConfig: IInMemoryConfig = {};
```

# For Developers

## Contributing

We welcome contributions to the Notification Framework. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request describing your changes.
5. Join our Facebook group! - [Facebook Group](https://www.facebook.com/groups/1569662676946579)

## Code Guidelines

To maintain code quality and consistency, please follow these guidelines:

1. Method naming:
   1. Async methods are prefixed with `gen`. e.g., `genResponse`
   2. Methods that might throw are suffixed with `X`, e.g., `buildX` or `genMarkAsReadX`
2. Keep external dependencies as low as possible
3. No offsite write! We delegate offsite writes to the Framework users.
4. Testing: Write unit tests for new features and bug fixes. Ensure all tests pass before submitting a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to reach out with any questions or suggestions. Happy coding! 🚀
