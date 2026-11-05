import type { ImageProps } from "expo-image";

import unauth from "./mock-user/unauth.png";
import user from "./mock-user/user.png";
import logo from "./polaris-favicon.png";

type IconSource = NonNullable<ImageProps["source"]>;

/** Local image assets used as icons. */
const icons = {
  // Metro resolves static image imports to a numeric asset reference.
  user: user as IconSource,
  unauth: unauth as IconSource,
  logo: logo as IconSource,
} as const;

export type IconName = keyof typeof icons;

export default icons;
