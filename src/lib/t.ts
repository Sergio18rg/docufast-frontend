// as of now, as it is not in the scope of the project we are not implementing i18n,
// so this is a simple function to get the message from the messages object
import { messages } from "@/messages";

export const t = (path: string): string => {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (typeof acc === "object" && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);

  return typeof value === "string" ? value : path;
};
