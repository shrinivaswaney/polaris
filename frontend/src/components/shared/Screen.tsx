import type { PropsWithChildren, ReactNode } from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppHeader } from "./AppHeader";

export type ScreenProps = PropsWithChildren<{
  /** Small section marker rendered in the header. */
  section?: string;
  /** Show a back affordance in the header. */
  showBack?: boolean;
  onBack?: () => void;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  /** Applied to the content area below the header. */
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Full-screen shell: themed background, editorial header, and content.
 * Use this instead of a bare `View` at the root of each screen.
 */
export function Screen({
  children,
  section,
  showBack,
  onBack,
  headerLeft,
  headerRight,
  style,
}: ScreenProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <AppHeader
        section={section}
        showBack={showBack}
        onBack={onBack}
        left={headerLeft}
        right={headerRight}
      />
      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
