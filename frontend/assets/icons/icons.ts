import type { ImageProps } from "expo-image";

import user from "./user.png";

type IconSource = NonNullable<ImageProps["source"]>;

/** Local image assets used as icons. */
const icons = {
  // Metro resolves static image imports to a numeric asset reference.
  user: user as IconSource,
} as const;

export type IconName = keyof typeof icons;

export default icons;
