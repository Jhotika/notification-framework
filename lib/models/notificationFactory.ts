import {
  AbstractNotification,
  type ConcreteClass,
} from "./abstractNotification";

export const notificationFactory = <T extends AbstractNotification<string>>(
  json: Readonly<Record<string, any>>,
  classes: Readonly<Array<ConcreteClass<T>>>
): T => {
  const className = json.type;
  const matchingClass = classes.find((cls) => cls.name === className);

  if (!matchingClass) {
    throw new Error(`Unknown class type: ${className}`);
  }

  const instance = new matchingClass(json);

  return instance;
};
