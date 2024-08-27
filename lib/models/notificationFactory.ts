import {
  AbstractNotification,
  type ConcreteClass,
} from "./abstractNotification";

export const notificationFactoryX = <T extends AbstractNotification<string>>(
  json: Readonly<Record<string, any>>,
  classes: Readonly<Array<ConcreteClass<T>>>
): T => {
  const className = json.type;
  const matchingClass = classes.find((cls) => cls.name === className);

  if (!matchingClass) {
    throw new Error(`notificationFactory: class not found for ${className}`);
  }

  return new matchingClass(json);
};
