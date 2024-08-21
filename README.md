# Notification Framework

This Framework provides a convenient interface and some features for managing notifications within your application.

## Table of Contents

- [Notification Framework](#notification-framework)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [Builder Pattern](#builder-pattern)
  - [Configuration](#configuration)
    - [MongoDB](#mongodb)
    - [Mongo Collections](#mongo-collections)
    - [In-Memory Database](#in-memory-database)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Interfaces to manage notifications and user-notifications features.
- Singleton pattern to ensure a single instance with consistent configuration.
- Supports multiple database configurations, including MongoDB, Mongo collections, and in-memory databases (more to come)
- Provides access to `NotificationService` and `UserNotificationMetadataService` for managing notifications and metadata.

## Installation

1. Clone the git repo

```bash
git clone https://github.com/Jhotika/notification-framework
```

2. Install the dependencies using npm,

```bash
npm install
```

or yarn

```bash
yarn add
```

## Usage

### Basic Usage

To use the `NotificationFramework`, you need to initialize it with a logger (optional) and a database configuration.

```typescript
import NotificationFramework from "notification-framework/lib";
import { DatabaseType } from "notification-framework/configs/db/database.config";
import { Logger } from "path/to/your/logger"; // example logger

const dbConfig = {
  type: DatabaseType.MongoDB,
  config: {
    // MongoDB configuration here
  },
};
const logger = new Logger();

const framework = NotificationFramework.getInstanceX(dbConfig, logger);

// Use the framework to get services
const notificationService = framework.getNotificationServiceX("viewerId");
const userMetadataService =
  framework.getUserNotificationMetadataServiceX("viewerId");
```

### Builder Pattern

You can also use the `NotificationFrameworkBuilder` to configure and create the framework instance.

```typescript
import { NotificationFrameworkBuilder } from "notification-framework";

const builder = new NotificationFrameworkBuilder()
  .withLogger(new Logger())
  .withMongoDbConfig({
    // MongoDB configuration here
  });

const framework = builder.buildX();

// Use the framework to get services
const notificationService = framework.getNotificationServiceX("viewerId");
const userMetadataService =
  framework.getUserNotificationMetadataServiceX("viewerId");
```

## Configuration

### MongoDB

To configure the framework with MongoDB, provide the MongoDB configuration object:

```typescript
import { IMongoDbConfig } from "notification-framework/configs/db/mongoDb.config";

const mongoDbConfig: IMongoDbConfig = {
  // MongoDB configuration options
};
```

### Mongo Collections

To configure the framework with Mongo collections:

```typescript
import { IMongoCollectionConfig } from "notification-framework/configs/db/mongoCollection.config";

const mongoCollectionsConfig: IMongoCollectionConfig = {
  notificationCollection:
    your - mongo - collection - to - store - the - notifications,
  userNotificationMetadataCollection:
    your - mongo - collection - to - store - the - notification - metadata,
};
```

### In-Memory Database

For in-memory database configuration:

```typescript
import { IInMemoryConfig } from "notification-framework/configs/db/inMemory.config";

const inMemoryConfig: IInMemoryConfig = {};
```

## Contributing

We welcome contributions to the Notification Framework. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request describing your changes.
5. Join our Facebook group! - https://www.facebook.com/groups/1569662676946579

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to reach out with any questions or suggestions. Happy coding! 🚀
