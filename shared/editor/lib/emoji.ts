import data from "@emoji-mart/data";
import { snakeCase } from "lodash";

export const nameToEmoji = Object.values(data.emojis).reduce((acc, emoji) => {
  acc[emoji.id] = emoji.skins[0].native;
  acc[snakeCase(emoji.id)] = emoji.skins[0].native;
  return acc;
}, {});
